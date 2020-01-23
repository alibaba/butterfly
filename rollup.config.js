import path from 'path';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import commonjs from 'rollup-plugin-commonjs';
import extensions from 'rollup-plugin-extensions';
import external from 'rollup-plugin-peer-deps-external';
import url from "rollup-plugin-url"

import pkg from './package.json';

const config = {
  presets: [
    '@babel/preset-react',
    '@babel/preset-env'
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties'
  ]
};


const plugins = [
  extensions({
    extensions: ['.js'],
    resolveIndex: true,
  }),
  external(),
  babel(Object.assign({
    exclude: [
      'node_modules/**',
    ]
  }, config)),
  postcss({
    extract: true,
    modules: false,
    use: [
      [
        'less',
        {
          javascriptEnabled: true,
        }
      ]
    ]
  }),
  commonjs(),
  json(),
  url({
    limit: 100 * 1024, // inline files < 100k, copy files > 100k
    include: ["**/*.svg", "**/*.eot", "**/*.tff", "**/*.woff", "**/*.woff2"], // defaults to .svg, .png, .jpg and .gif files
    emitFiles: true // defaults to true
  })
];

const rollupCfg = [];

// all in one 构建
rollupCfg.push({
  input: path.join(__dirname, 'index.js'),
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],
  plugins
});

export default rollupCfg;
