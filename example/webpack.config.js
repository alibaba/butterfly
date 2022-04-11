const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const devServer = require('./dev/dev-server');
const {getDemoList, getDemoFiles} = require('./dev/util');

const distdir = path.join(__dirname, 'dist');

fs.removeSync(distdir);
fs.ensureDirSync(distdir);

const generate = async () => {
  const list = await getDemoList();

  await fs.writeFile(
    path.join(
      distdir,
      'list.json'
    ),
    JSON.stringify(list, null, 2)
  );

  for (let demo of list) {
    try {
      await fs.ensureDir(
        path.join(distdir, demo.dir)
      );

      const filesjson = await getDemoFiles(demo.dir);
      await fs.ensureDir(distdir, demo.dir);

      await fs.writeFile(
        path.join(distdir, demo.dir, 'files.json'),
        JSON.stringify(filesjson, null, 2)
      );

      await fs.copy(
        path.join(__dirname, 'demo', demo.dir, 'cover.png'),
        path.join(distdir, demo.dir, 'cover.png')
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(`处理${demo.dir}失败`, e.stack);
    }
  }

  await fs.copy(
    path.join(__dirname, 'index.html'),
    path.join(distdir, 'index.html')
  );

  await fs.copy(
    path.join(__dirname, 'static'),
    path.join(distdir, 'static')
  );
};

const publicPath = '/butterfly-dag/';

if (process.env.NODE_ENV === 'production') {
  generate();
}

let output = {
  filename: '[name].[hash].js',
  chunkFilename: '[name].[hash].js',
  publicPath: publicPath
};

if (process.env.NODE_ENV !== 'production') {
  output.chunkFilename = output.filename = '[name].js';
}

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    app: './index.jsx'
  },
  output: output,
  resolve: {
    modules: [
      path.resolve(process.cwd(), 'node_modules'),
      path.resolve(process.cwd(), '../node_modules'),
      'node_modules'
    ],
    extensions: ['.js', '.jsx', '.json']
  },
  devtool: 'eval-source-map',
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
    }),
    new webpack.DefinePlugin({
      PREFIX: `"${publicPath}"`
    })
  ],
  devServer: {
    contentBase: __dirname, // 本地服务器所加载的页面所在的目录
    historyApiFallback: true, // 不跳转
    inline: true, // 实时刷新
    index: 'index.html',
    publicPath: '/butterfly-dag',
    port: 8080,
    open: true,
    before(app) {
      devServer(app);
    }
  }
};
