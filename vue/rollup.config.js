import fs from 'fs';
import path from 'path';

import { babel } from '@rollup/plugin-babel';
import VuePlugin from 'rollup-plugin-vue'
import css from 'rollup-plugin-css-only';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { terser } from "rollup-plugin-terser";

import pkg from './package.json';

const dist = path.join(__dirname, 'dist');

if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist);
}


export default {
  input: 'index.js',
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
    peerDepsExternal(),
    resolve(),
    commonjs(),
    VuePlugin(),
    css({ output: 'index.css' }),
    babel(
      {
        exclude: 'node_modules/**',
        presets: ['@babel/preset-env'],
        plugins: [
          "@babel/plugin-proposal-class-properties",
        ]
      }
    ),
    terser()
  ]
}
