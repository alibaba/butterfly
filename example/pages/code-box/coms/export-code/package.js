export default {
  name: 'example',
  version: '1.0.0',
  scripts: {
    start: 'webpack-dev-server',
  },
  dependencies: {
    '@stackblitz/sdk': '^1.5.2',
    antd: '~3.26.7',
    axios: '^0.21.1',
    'butterfly-dag': '*',
    react: '~16.12.0',
    'react-dom': '~16.12.0',
  },
  devDependencies: {
    '@babel/core': '~7.8.3',
    '@babel/plugin-proposal-class-properties': '~7.8.3',
    '@babel/plugin-proposal-object-rest-spread': '~7.8.3',
    '@babel/plugin-syntax-dynamic-import': '^7.8.3',
    '@babel/plugin-transform-runtime': '^7.12.1',
    '@babel/preset-env': '~7.8.3',
    '@babel/preset-react': '~7.8.3',
    'babel-loader': '8.0.6',
    'babel-plugin-transform-es2015-modules-commonjs': '~6.26.2',
    'css-loader': '~1.0.0',
    'file-loader': '~2.0.0',
    less: '~3.7.0',
    'less-loader': '~4.1.0',
    'mini-css-extract-plugin': '~0.9.0',
    'style-loader': '~0.21.0',
    'style-resources-loader': '^1.4.1',
    'url-loader': '~1.0.1',
    webpack: '~4.41.5',
    'webpack-cli': '~3.0.8',
    'webpack-dev-server': '~3.10.1'
  }
};
