let webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  performance: {
    hints: false
  },
  entry: './index.js',
  output: {
    path: __dirname,
    filename: 'dist/index.js',
    libraryTarget: 'umd',
  },
  resolve: { 
    alias: {},
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'dist/index.css',
      chunkFilename: '[id].css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'], //'env'--babel7中的es7语法编译插件
            // plugins: ['transform-decorators-legacy', 'transform-class-properties', 'add-module-exports', 'transform-object-rest-spread'],
            plugins: ['transform-es2015-modules-commonjs', '@babel/plugin-proposal-object-rest-spread', '@babel/plugin-proposal-class-properties']
          }
        }
      }, {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader, {
            loader: "css-loader" // translates CSS into CommonJS
        }, {
            loader: "less-loader" // compiles Less to CSS
        }]
      }, {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1024 * 200,
            name: '[name].[ext]',
            outputPath: '/dist/fonts/'
          }
        }
      }
    ]
  }
};