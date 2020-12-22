
const path = require('path')
const { merge } = require('webpack-merge');
const SRC_PATH = path.join(__dirname, 'src')

const PATHS = {
  src: path.join(__dirname, 'src'),
  entry: path.join(__dirname, 'src', '/index.ts'),
  node_modules: path.join(__dirname, '/node_modules'),
};

const PATH_ALIASES = {
  '@': path.resolve(__dirname, 'src'),
  'react': path.resolve(__dirname, './node_modules/react') ,
  'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
  'formik': path.resolve(__dirname, './node_modules/formik'), 
  '@material-ui': path.resolve(__dirname, './node_modules/@material-ui'), 
  'assets': path.resolve(__dirname, 'src', 'assets'),
};

const commonConfig = merge([
  {
    resolve: {
      alias: PATH_ALIASES,
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    externals: [{
      react: {          
          commonjs: "react",          
          commonjs2: "react",          
          amd: "React",          
          root: "react"      
      },      
      "react-dom": {          
          commonjs: "react-dom",          
          commonjs2: "react-dom",          
          amd: "ReactDOM",          
          root: "reactDOM"      
      },
      "formik": {          
        commonjs: "formik",          
        commonjs2: "formik",          
        amd: "formik",          
        root: "formik"      
      },
      "material-table": {
        commonjs: "material-table",          
        commonjs2: "material-table",          
        amd: "material-table",          
        root: "material-table"
      },
      "react-dropzone": {
        commonjs: "react-dropzone",          
        commonjs2: "react-dropzone",          
        amd: "react-dropzone",          
        root: "react-dropzone"
      },
      "jspdf": {
        commonjs: "jspdf",          
        commonjs2: "jspdf",          
        amd: "jspdf",          
        root: "jspdf"
      },
      "@material-ui/icons": {
        commonjs: "@material-ui/icons",          
        commonjs2: "@material-ui/icons",          
        amd: "@material-ui/icons",          
        root: "@material-ui/icons"
      },
      "@material-ui/core": {
        commonjs: "@material-ui/core",          
        commonjs2: "@material-ui/core",          
        amd: "@material-ui/core",          
        root: "@material-ui/core"
      },
      "@material-ui/lab": {
        commonjs: "@material-ui/lab",          
        commonjs2: "@material-ui/lab",          
        amd: "@material-ui/lab",          
        root: "@material-ui/lab"
      },
      "@material-ui/styles": {
        commonjs: "@material-ui/styles",          
        commonjs2: "@material-ui/styles",          
        amd: "@material-ui/styles",          
        root: "@material-ui/styles"
      },
      "@material-ui/core/styles": {
        commonjs: "@material-ui/core/styles",          
        commonjs2: "@material-ui/core/styles",          
        amd: "@material-ui/core/styles",          
        root: "@material-ui/core/styles"
      },
    },
    /@material-ui\/core\/.*/,
  ],
  },
])

module.exports = () => {

  const config = {
    entry: PATHS.entry,
    output: {
      path: path.join(__dirname, "dist"),
      filename: "bundle.js",
      libraryTarget: "commonjs2"
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: "babel-loader",
          exclude: /node_modules/
        },
        {
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
        }
      ]
    },
    resolve: {
      alias: PATH_ALIASES,
      extensions: [".js", ".jsx"]
    },
  }
  return merge(config, commonConfig)
};