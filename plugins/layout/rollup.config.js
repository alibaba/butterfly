import fs from 'fs';
import path from 'path';

import { babel } from '@rollup/plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

import pkg from './package.json';



const dist = path.join(__dirname, 'dist');

if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist);
}

const plugins = [
  commonjs(),
  babel(
    {
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env'],
      plugins: [
        "@babel/plugin-proposal-class-properties",
      ]
    }
  ),
];

const main = {
  input: './src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    },
    {
      file: pkg.unpkg,
      format: 'umd',
      sourcemap: true,
      name: pkg.name
    }
  ],
  plugins: plugins
};

const graphvizLayout = {
  input: './src/graphviz/index.js',
  output: [
    {
      file: 'graphvizLayout.js',
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: plugins
};

export default [main, graphvizLayout];