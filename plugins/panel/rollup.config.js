import fs from 'fs';
import path from 'path';

import { babel } from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import image from 'rollup-plugin-img';
import url from "rollup-plugin-url";
import { terser } from "rollup-plugin-terser";

import pkg from './package.json';



const dist = path.join(__dirname, 'dist');

if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist);
}


export default {
  input: 'src/index.js',
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
    babel(
      {
        exclude: 'node_modules/**',
        presets: ['@babel/preset-env'],
        plugins: [
          "@babel/plugin-proposal-class-properties",
        ]
      }
    ),
    image({
      output: 'dist/images',
      limit: 8192,  // default 8192(8k)
      exclude: 'node_modules/**'
    }),
    url(
      {
        limit: 100 * 1024, // inline files < 100k, copy files > 100k
        include: ["**/*.svg", "**/*.eot", "**/*.tff", "**/*.woff", "**/*.woff2"], // defaults to .svg, .png, .jpg and .gif files
        emitFiles: true // defaults to true
      }
    ),
    terser()
  ]
}