let webpack = require('webpack');

module.exports = {
  entry: './index.js',
  output: {
    path: __dirname,
    filename: 'dist/index.js',
    libraryTarget: 'umd',
  },
  resolve: { 
    alias: {},
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react'], //'env'--babel7中的es7语法编译插件
            plugins: ['transform-decorators-legacy', 'transform-class-properties', 'add-module-exports', 'transform-object-rest-spread'],
          }
        }
      }, {
        test: /\.less$/,
        use: [{
            loader: "style-loader" // creates style nodes from JS strings
        }, {
            loader: "css-loader" // translates CSS into CommonJS
        }, {
            loader: "less-loader" // compiles Less to CSS
        }]
      }, {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
            outputPath: '/dist/fonts/'
          }
        }
      }
    ]
  }
};