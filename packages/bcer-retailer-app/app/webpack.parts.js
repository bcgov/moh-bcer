const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const { JsonFormatter } = require('tslint/lib/formatters');

const postCSSLoader = {
  loader: 'postcss-loader',
  options: {
    plugins: () => ([autoprefixer]),
  },
};

exports.devServer = ({ host, port } = {}) => ({
  devServer: {
    historyApiFallback: true,
    stats: 'errors-only',
    hot: true,
    open: true,
    host,
    port,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    },
    overlay: {
      errors: true,
      warnings: true,
    },
  },
});

exports.loadJS = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        loaders: ['babel-loader', 'ts-loader'],
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
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [path.resolve(__dirname, 'node_modules')],
              }
            },
          },
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
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [path.resolve(__dirname, 'node_modules')],
              }
            },
          },
        ],
      },
    ]
  }
})

exports.extractCSS = ({ include, exclude, filename } = {}) => ({
  module: {
    rules: [
      {
        test: /\.s?css$/,
        include,
        exclude,
        use: [
          'style-loader',
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
        use: {
          loader: 'file-loader',
          options,
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
    minimizer: [new TerserPlugin()],
  },
});

exports.CSSOptimization = ({ options } = {}) => ({
  plugins: [
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: options,
      canPrint: false,
    }),
  ],
});

exports.setEnvironmentVariable = (nodeEnv, dotEnv, assetPath) => ({
  /*
  * Add new environment variables by creating a new constant, and assigning
  * it to dotEnv.ENV_VAR_FROM_FILE
  * e.g:
  *
  * 'process.env': {
  *     NODE_ENV: JSON.stringify(nodeEnv),
  *     BASE_URL: JSON.stringify(dotEnv.BASE_URL),
  *     NEW_ENV: JSON.stringify(dotEnv.NEW_DOTENV_VARIABLE)
  *     ASSET_PATH: JSON.stringify(assetPath),
  *   },
  *
  * Additionally, you can make the entire dotenv file accessable by
  * doing something like
  *
  * DOT_ENV: JSON.stringify(dotEnv),
  *
  */

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
          from,
          to,
          globOptions: {
            ignore: ['*.html']
          }
        },
      ]
    }),
  ],
});

exports.registerServiceWorker = () => ({
  plugins: [
    new SWPrecacheWebpackPlugin({
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      filename: 'service-worker.js',
      minify: true,
      navigateFallback: '/index.html',
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
    }),
  ],
});

exports.extractManifest = () => ({
  plugins: [
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
    }),
  ],
});
