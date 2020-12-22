
const path = require('path')
const { merge } = require('webpack-merge');

const SRC_PATH = path.join(__dirname, '../src')

const PATHS = {
  src: path.join(__dirname, '../src'),
  entry: path.join(__dirname, '../src', '../index.tsx'),
  node_modules: path.join(__dirname, '../node_modules'),
};

const PATH_ALIASES = {
  '@': path.resolve(__dirname, '../src'),
  'assets': path.resolve(__dirname, '../src', 'assets'),
};

const commonConfig = merge([
  {
    resolve: {
      alias: PATH_ALIASES,
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
  }
])

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    include: [SRC_PATH],
    use: [
      {
        loader: require.resolve('awesome-typescript-loader'),
        options: {
          configFileName: './tsconfig.json'
        }
      }
    ],
  })
  
  

  return merge(commonConfig, config)
}