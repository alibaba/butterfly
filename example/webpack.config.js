const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const devServer = require('./dev-server');

module.exports = {
  entry: {
    app: './index.jsx'
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    modules: [
      path.resolve(process.cwd(), 'node_modules'),
      path.resolve(process.cwd(), '../node_modules'),
      'node_modules'
    ],
    extensions: ['.js', '.jsx']
  },
  devtool: 'cheap-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ],
            plugins: [
              '@babel/plugin-transform-runtime',
              '@babel/plugin-transform-modules-commonjs',
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-syntax-dynamic-import'
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
          },
          {
            loader: 'style-resources-loader',
            options: {
              patterns: path.resolve(__dirname, './colorVariable.less'),
            },
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
    })
  ],
  devServer: {
    contentBase: __dirname, // 本地服务器所加载的页面所在的目录
    historyApiFallback: true, // 不跳转
    inline: true, // 实时刷新
    index: 'index.html',
    port: 8080,
    open: true,
    before(app) {
      devServer(app);
    }
  }
};
