import fs from 'fs';
import path from 'path';

import { babel } from '@rollup/plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

import pkg from './package.json';



const dist = path.join(__dirname, 'dist');

if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist);
}


export default {
  input: './index.js',
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
  plugins: [
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
  ]
}