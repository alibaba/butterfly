import JSZip from 'jszip';
import _ from 'lodash';
import * as download from 'download.js';

import html from '../html';
import pkg from './package';
import readme from './README.md.js';
import webpackCfg from './webpack.config';

const defaultFiles = [
  {
    filename: 'webpack.config.js',
    code: webpackCfg
  },
  {
    filename: 'index.html',
    code: html
  },
  {
    filename: 'README.md',
    code: readme
  }
];

/**
 * 导出一个可执行的代码
 * @param {Array} codes
 *             - code {String} 每个文件的代码内容
 *             - filename {String} 每个文件的文件名
 */
const exportCode = async (codes) => {
  const zip = new JSZip();
  const src = zip.folder('src');

  for (let file of codes) {
    src.file(file.filename, file.code);
  }

  for (let file of defaultFiles) {
    zip.file(file.filename, file.code);
  }


  let finalPkg = pkg;
  let userPkg = codes.find(code => code.filename === 'package.json');

  // 合并依赖，所有的package.json 单独处理
  if (userPkg) {
    userPkg = JSON.parse(userPkg.code);
    finalPkg = _.merge({}, finalPkg, userPkg);
  }

  zip.file('package.json', JSON.stringify(finalPkg, null, 2));

  const content = await zip.generateAsync({type: 'blob'});

  download.downloadBlob(
    'demo.zip',
    content
  );
};

export default exportCode;
