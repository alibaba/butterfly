import fs from 'fs';
import path from 'path';
import babel from '@rollup/plugin-babel';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';

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
    external(),
    postcss({
      modules: false
    }),
    babel(
      {
        "presets": [
          [
            "@babel/preset-env", {
              "modules": false
            }
          ],
          "@babel/preset-react"
        ],
        plugins: [
        ]
      }
    )
  ]
};
