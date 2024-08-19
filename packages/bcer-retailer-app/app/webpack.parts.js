const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const postCSSLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [
        autoprefixer
      ],
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
  },
});

exports.loadJS = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        include,
        exclude,
        use: 'babel-loader',
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
          loader: 'url-loader',
          options: {
            limit: 10000, // Inline files smaller than 10 kB
            ...options,
          },
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
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
  },
});

exports.CSSOptimization = () => ({
  optimization: {
    minimizer: [
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
  },
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

exports.copy = (patterns = []) => ({
  plugins: [
    new CopyWebpackPlugin({
      patterns: patterns.map((pattern) => ({ from: pattern })),
    }),
  ],
});

exports.registerServiceWorker = () => ({
  plugins: [
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
});

exports.extractManifest = () => ({
  plugins: [
    new WebpackManifestPlugin(),
  ],
});