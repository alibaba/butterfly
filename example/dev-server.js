const fs = require('fs-extra');
const path = require('path');

const DEFAULT_IMG = 'https://s3.ax1x.com/2021/02/13/yrjkOH.jpg';

module.exports = (app) => {
  app.get('/list.json', async (req, res) => {
    const demosdir = path.join(__dirname, 'demo');
    const demos = await fs.readdir(demosdir);

    let list = await Promise.all(demos.map(async demodir => {
      const coverExsit = await fs.exists(
        path.join(demosdir, demodir, 'cover.png')
      );

      if (demodir.startsWith('.')) {
        return false;
      }

      let pkg = {
        name: demodir,
        // eslint-disable-next-line
        cn_name: demodir,
        description: demodir,
        // eslint-disable-next-line
        cn_description: demodir,
        cover: coverExsit ? `/${demodir}/cover.png` : DEFAULT_IMG
      };

      try {
        pkg = JSON.parse(
          (await fs.readFile(
            path.join(__dirname, demodir, 'package.json')
          )).toString()
        );
      } catch (e) {
        return pkg;
      }
    }));

    // 过滤非目录的文件
    list = list.filter(i => !!i);

    return res.send(list);
  });

  app.get('/:demo/files.json', async (req, res) => {
    const demo = req.params.demo;

    const files = await fs.readdir(path.join(__dirname, 'demo', demo));

    let json = await Promise.all(files.map(async file => {
      if (file.endsWith('.png')) {
        return false;
      }

      let code = (await fs.readFile(
        path.join(__dirname, 'demo', demo, file)
      )).toString();

      return {
        filename: file,
        code: code
      };
    }));

    json = json.filter(i => !!i);

    return res.send(json);
  });

  app.get('/:demo/cover.png', async (req, res) => {
    const demo = req.params.demo;

    const pngpath = path.join(__dirname, 'demo', demo, 'cover.png');

    try {
      const buffer = await fs.readFile(pngpath);

      res.write(buffer);
      return res.end();
    } catch (e) {
      return res.redirect(DEFAULT_IMG);
    }
  });
};
