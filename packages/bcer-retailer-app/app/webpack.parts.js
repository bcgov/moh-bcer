const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

const postCSSLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [autoprefixer],
    },
  },
};

exports.devServer = ({ host, port } = {}) => ({
  devServer: {
    historyApiFallback: true,
    hot: true,
    open: true,
    host,
    port,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    },
    client: {
      overlay: {
        errors: true,
        warnings: true,
      },
    },
  },
});

exports.loadJS = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        use: ['babel-loader', 'ts-loader'],
        include,
        exclude,
      },
    ],
  },
});

exports.loadCSS = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.s?css$/,
        include,
        exclude,
        use: [
          'style-loader',
          'css-loader',
          postCSSLoader,
          'sass-loader',
        ],
      },
    ],
  },
});

exports.loadCSSModules = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.module\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true
            }
          },
          'sass-loader',
        ],
      },
    ]
  }
});

exports.extractCSS = ({ include, exclude, filename } = {}) => ({
  module: {
    rules: [
      {
        test: /\.s?css$/,
        include,
        exclude,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          postCSSLoader,
          'sass-loader'
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename,
    }),
  ],
});

exports.loadImages = ({ include, exclude, urlLoaderOptions, fileLoaderOptions, imageLoaderOptions} = {}) => ({
  module: {
    rules: [
      {
        test: /\.(gif|png|jpe?g)$/,
        include,
        exclude,
        loader: 'url-loader',
        options: urlLoaderOptions,
      },
      {
        test: /\.svg$/,
        include,
        exclude,
        use: [
            {
                loader: '@svgr/webpack'
            },
            {
                loader: 'file-loader',
                options: fileLoaderOptions,
            }
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/,
        include,
        exclude,
        loader: 'image-webpack-loader',
        options: {
          bypassOnDebug: true,
          ...imageLoaderOptions,
        },
      },
    ],
  },
});

exports.loadFonts = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(woff(2)?|ttf|otf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        include,
        exclude,
        type: 'asset/resource',
        generator: {
          filename: options.name,
        },
      },
    ],
  },
});

exports.generateSourceMaps = ({ type } = {}) => ({
  devtool: type,
});

exports.bundleOptimization = ({ options } = {}) => ({
  optimization: {
    splitChunks: options,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
});

exports.CSSOptimization = ({ options } = {}) => ({
  optimization: {
    minimizer: [
      new CssMinimizerPlugin({
        minimizerOptions: options,
      }),
    ],
  },
});

exports.setEnvironmentVariable = (nodeEnv, dotEnv, assetPath) => ({
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(nodeEnv),
        BASE_URL: JSON.stringify(dotEnv.BASE_URL),
        ASSET_PATH: JSON.stringify(assetPath),
        BASE_KEYCLOAK_URL: JSON.stringify(dotEnv.BASE_KEYCLOAK_URL),
        KEYCLOAK_REALM: JSON.stringify(dotEnv.KEYCLOAK_REALM),
        KEYCLOAK_CLIENTID: JSON.stringify(dotEnv.KEYCLOAK_CLIENTID),
        GOOGLE_MAPS_API_KEY: JSON.stringify(dotEnv.GOOGLE_MAPS_API_KEY)
      },
    }),
  ],
});

exports.gZipCompression = () => ({
  plugins: [
    new CompressionPlugin({
      algorithm: 'gzip',
    }),
  ],
});

exports.clean = () => ({
  plugins: [
    new CleanWebpackPlugin(),
  ],
});

exports.copy = (from, to) => ({
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, from),
          to: path.resolve(__dirname, to),
          globOptions: {
            ignore: ['*.html'],
          },
        },
      ],
    }),
  ],
});

exports.registerServiceWorker = () => ({
  plugins: [
    new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
});

exports.extractManifest = () => ({
  plugins: [
    new WebpackManifestPlugin({
      fileName: 'asset-manifest.json',
    }),
  ],
});