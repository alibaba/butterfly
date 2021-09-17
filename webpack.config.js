const _ = require('lodash');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const common = {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  performance: {
    hints: false
  },
  entry: './index.js',
  target: ['web', 'es5'],
  output: {
    path: __dirname,
    filename: 'dist/index.js',
    libraryTarget: 'umd',
    environment: {
      arrowFunction: false
    }
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
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader" // translates CSS into CommonJS
          },
          {
            loader: "less-loader" // compiles Less to CSS
          }
        ]
      },
      {
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
  },
  optimization: {
    minimize: false
  }  
};

const main = _.cloneDeep(common);
const unpkg = _.cloneDeep(common);

/**
 * unpkg包需要满足条件：
 * 1. no sourcemap
 * 2. no mini-css-extract-plugin
 * 3. minimize: true
 */
unpkg.optimization.minimize = true;
delete unpkg.devtool;
unpkg.output.filename = 'unpkg/index.unpkg.js';
unpkg.plugins.pop();
unpkg.module.rules[1].use.shift();

module.exports = [
  main,
  unpkg
];
