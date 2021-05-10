import less from 'less';
import path from 'path';
import * as Babel from '@babel/standalone';

// ================= 执行依赖 =================
import _ from 'lodash';
import * as Antd from 'antd';
import React from 'react';
import Jquery from 'jquery';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Butterfly from 'butterfly-dag';
import ButterflyReact from 'butterfly-react';
import 'butterfly-dag/dist/index.css';
// ================= 执行依赖 =================

import LocalFileManagerPlugin from './less-local-plugin';

const wrapCss = (code) => {
  // 转移
  const encode = code.replace(/\\/g, '\\\\');

  return `
    const style = document.createElement('style');
    style.innerHTML = \`${encode}\`;
    const element = document.getElementById('style-inject');
    element.appendChild(style);
  `;
};

const tryFindFile = (basename, files) => {
  const exsit = files.find(f => f.filename === basename);

  if (exsit) {
    return exsit;
  }

  if (/.+jsx?$/.test(basename)) {
    return files.find(f => f.filename === basename);
  }

  return tryFindFile(basename + '.jsx', files) || tryFindFile(basename + '.js', files);
};

const runModule = (entry, cache, files) => {
  const module = {
    exports: {

    },
    cache: {
      ...cache,
      react: React,
      'butterfly-dag': Butterfly,
      'react-dom': ReactDOM,
      jquery: Jquery,
      'butterfly-react': ButterflyReact,
      antd: Antd,
      'prop-types': PropTypes,
      lodash: _
    }
  };

  const require = (filename) => {
    if (module.cache[filename]) {
      return module.cache[filename];
    }

    if (filename.startsWith('.')) {
      const basename = path.basename(filename);
      const file = tryFindFile(basename, files);

      if (!file) {
        return;
      }

      return runModule(file, module.cache, files);
    }

    if (filename.endsWith('.css') || filename.endsWith('.less')) {
      return;
    }
  };

  entry.func(module, module.exports, require);

  module.cache[entry.filename] = module.exports;

  return module.exports;
};

const evalCode = async (files) => {
  if (files.length === 0) {
    return;
  }

  const evalFiles = _.cloneDeep(files);

  for (let file of evalFiles) {
    const filename = file.filename;

    if (filename.endsWith('.js') || filename.endsWith('.jsx')) {
      file.evalCode = Babel.transform(file.code, {
        presets: ['env', 'react'],
        sourceMaps: 'inline'
      }).code;
    }

    if (filename.endsWith('.less')) {
      const output = await less.render(
        file.code,
        {
          plugins: [
            new LocalFileManagerPlugin(files)
          ]
        }
      );
      file.evalCode = wrapCss(output.css);
    }

    if (filename.endsWith('.css')) {
      file.evalCode = wrapCss(file.code);
    }

    if (!file.evalCode) {
      continue;
    }

    // eslint-disable-next-line
    file.func = (module, exports, require) => eval(file.evalCode);
  }

  const entry = evalFiles.find(f => f.filename === 'index.jsx');

  runModule(entry, {}, evalFiles);
};

export default evalCode;
