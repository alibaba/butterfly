const path = require('path');
const fs = require('fs-extra');

const demosdir = path.join(__dirname, '..', 'demo');
const DEFAULT_IMG = 'https://s3.ax1x.com/2021/02/13/yrjkOH.jpg';

/**
 * 获取所有的demo列表
 * @return {Array} list
 *               - name {String} 英文名
 *               - cn_name {String} 中文名
 *               - description {String} 英文描述
 *               - cn_description {String} 中文描述
 *               - cover {String} 封面地址[http(s)]
 *               - dir {String} 文件夹的名称
 */
const getDemoList = async () => {
  const demos = await fs.readdir(demosdir);

  let list = await Promise.all(demos.map(async demodir => {
    const coverExsit = await fs.exists(
      path.join(demosdir, demodir, 'cover.png')
    );

    if (demodir.startsWith('.')) {
      return false;
    }

    let cover = coverExsit ? `/${demodir}/cover.png` : DEFAULT_IMG;

    let pkg = {
      name: demodir,
      // eslint-disable-next-line
      cn_name: demodir,
      description: demodir,
      // eslint-disable-next-line
      cn_description: demodir,
      cover: cover,
      dir: demodir,
    };

    try {
      pkg = Object.assign(
        {}, pkg,
        JSON.parse(
          (await fs.readFile(
            path.join(demosdir, demodir, 'package.json')
          )).toString()
        )
      );

      return pkg;
    } catch (e) {
      if (e.code === 'ENOENT') {
        // eslint-disable-next-line no-console
        console.warn(`找不到demo：${demodir} 的 package.json，使用默认配置`);
      }

      return pkg;
    }
  }));

  // 过滤非目录的文件
  list = list.filter(i => !!i);

  return list;
};

const less = {
  filename: 'theme.less',
  code: fs.readFileSync('./theme.less').toString()
};


/**
 * 获取一个demo下的所有文件
 * @param {String} demo 需要查看的demo
 * @return {Array} result
 *               - filename {String} 文件名
 *               - code {String} 代码
 */
const getDemoFiles = async (demo) => {
  const files = await fs.readdir(path.join(demosdir, demo));

  let json = await Promise.all(files.map(async file => {
    if (file.endsWith('.png')) {
      return false;
    }

    let code = (await fs.readFile(
      path.join(demosdir, demo, file)
    )).toString();

    if (file.endsWith('.less')) {
      code = '@import \'theme.less\'; \n' + code;
    }

    return {
      filename: file,
      code: code
    };
  }));

  json = [
    ...json.filter(i => !!i),
    less
  ];

  return json;
};

module.exports = {
  getDemoList,
  DEFAULT_IMG,
  getDemoFiles
};
