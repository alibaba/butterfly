import _ from 'lodash';
import JSZip from 'jszip';
import download from 'download.js';


const defaultFiles = [
  {
    filename: 'webpack.config.js',
    code: ''
  },
  {
    filename: 'package.json',
    code: ''
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

  const content = await zip.generateAsync({type: 'blob'});

  download.downloadBlob(
    'demo.zip',
    content
  );
};

export default exportCode;
