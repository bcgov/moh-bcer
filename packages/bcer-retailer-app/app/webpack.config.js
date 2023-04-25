const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const path = require('path');
const parts = require('./webpack.parts');
const dotenv = require('dotenv');

const DEVELOPMENT = 'development';
const PRODUCTION = 'production';
const ASSET_PATH = process.env.ASSET_PATH || '/';
const PATHS = {
  src: path.join(__dirname, 'src'),
  entry: path.join(__dirname, 'src', 'index.tsx'),
  public: path.join(__dirname, 'public'),
  template: path.join(__dirname, 'public', 'index.html'),
  build: path.join(__dirname, 'build'),
  node_modules: path.join(__dirname, 'node_modules'),
};
const BUILD_FILE_NAMES = {
  css: 'style/[name].[contenthash:4].css',
  bundle: 'js/bundle.[chunkhash:4].js',
  vendor: 'js/[id].[chunkhash:4].js',
  assets: 'assets/[name].[hash:4].[ext]',
};
const PATH_ALIASES = {
  '@': path.resolve(__dirname, 'src'),
  react: path.resolve('./node_modules/react'),
  'formik': path.resolve('./node_modules/formik'),
  '@material-ui': path.resolve('./node_modules/@material-ui'),
  'assets': path.resolve(__dirname, 'src', 'assets'),
};

const env = dotenv.config().parsed;
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[next] = env[next];
  return prev;
}, {});

const commonConfig = merge([
  {
    entry: {
      main: ['@babel/polyfill', PATHS.entry],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: PATHS.template,
      }),
    ],
    resolve: {
      alias: PATH_ALIASES,
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
  },
  parts.loadJS({
    include: PATHS.src,
    exclude: PATHS.node_modules,
  }),
  parts.loadFonts({
    exclude: path.join(PATHS.src, 'assets', 'images'),
    options: {
      name: BUILD_FILE_NAMES.assets,
    },
  }),
]);

const devConfig = merge([
  {
    output: {
      path: PATHS.build,
      publicPath: ASSET_PATH,
      filename: 'bundle.js',
    },
    watch: true,
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 600,
      poll: 1000,
    },
  },
  parts.setEnvironmentVariable(DEVELOPMENT, envKeys, ASSET_PATH),
  parts.generateSourceMaps({
    type: 'inline-source-map',
  }),
  parts.devServer({}),
  parts.loadCSS({ exclude: /\.module\.scss$/ }),
  parts.loadCSSModules(),
  parts.loadImages({
    exclude: path.join(PATHS.src, 'assets', 'fonts'),
  }),
]);

const prodConfig = merge([
  {
    output: {
      path: PATHS.build,
      publicPath: '/retailer/',
      chunkFilename: BUILD_FILE_NAMES.vendor,
      filename: BUILD_FILE_NAMES.bundle,
    },
  },
  parts.clean(),
  parts.setEnvironmentVariable(PRODUCTION, envKeys, ASSET_PATH),
  parts.extractCSS({
    filename: BUILD_FILE_NAMES.css,
  }),
  parts.loadImages({
    exclude: path.join(PATHS.src, 'assets', 'fonts'),
    urlLoaderOptions: {
      limit: 10 * 1024,
      name: BUILD_FILE_NAMES.assets,
    },
    fileLoaderOptions: {
      name: BUILD_FILE_NAMES.assets,
    },
    imageLoaderOptions: {
      mozjpeg: {
        progressive: true,
        quality: 40,
      },
      pngquant: {
        quality: [0.5, 0.6],
        speed: 4,
      },
    },
  }),
  parts.bundleOptimization({
    options: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'initial',
        },
      },
    },
  }),
  parts.CSSOptimization({
    discardComments: {
      removeAll: true,
    },
    safe: true,
  }),
  parts.gZipCompression(),
  parts.registerServiceWorker(),
  parts.extractManifest(),
  parts.copy(PATHS.public, path.join(PATHS.build, 'public')),
]);

module.exports = (env) => {
  return env === PRODUCTION
    ? merge(commonConfig, prodConfig, { mode: env })
    : merge(commonConfig, devConfig, { mode: env });
};
