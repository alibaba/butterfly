'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
  entry: {
    app: './index.jsx'
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  resolve: {
    modules: [
      path.resolve(process.cwd(), 'node_modules'),
      path.resolve(process.cwd(), '../node_modules'),
      'node_modules'
    ]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: ['es2015-node5', 'react'],

            plugins: [
              // require('babel-plugin-add-module-exports'),
              // require('babel-plugin-transform-decorators-legacy'),
              // require('babel-plugin-transform-class-properties'),
              // require('babel-plugin-transform-object-rest-spread'),
              // [require('babel-plugin-transform-runtime'), {
              //   helpers: false, // defaults to true
              //   polyfill: false, // defaults to true
              //   regenerator: true, // defaults to true
              // }],
              'add-module-exports',
              'transform-decorators-legacy',
              'transform-class-properties',
              'transform-object-rest-spread',
              ['transform-runtime', {
                helpers: false, // defaults to true
                polyfill: false, // defaults to true
                regenerator: true, // defaults to true
              }]
            ]
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: {
          loader: 'file-loader',

          options: {
            name: '[name][hash].[ext]',
            outputPath: 'fonts/'
          }
        }
      },
      {
        test: /\.(less|css)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ],
  devServer: {
    contentBase: './dist', // 本地服务器所加载的页面所在的目录
    historyApiFallback: true, // 不跳转
    inline: true, // 实时刷新
    index: 'index.html',
    port: 8080,
    open: true
  }
};