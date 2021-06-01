import fs from 'fs';
import path from 'path';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import {nodeResolve} from '@rollup/plugin-node-resolve';

import pkg from './package.json';

const dist = path.join(__dirname, 'dist');

if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist);
}

export default {
  input: 'index.jsx',
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
    nodeResolve({
      extensions: ['.js', '.json', '.jsx']
    }),
    external(),
    postcss({
      modules: false
    }),
    babel(
      {
        presets: [
          [
            '@babel/preset-env', {
              modules: false,
              targets: {
                chrome: '60'
              }
            }
          ],
          '@babel/preset-react'
        ],
        plugins: [
        ]
      }
    )
  ]
};
