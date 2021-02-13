const fs = require('fs-extra');
const path = require('path');


module.exports = (app) => {
  app.get('/list.json', async (req, res) => {
    const demosdir = path.join(__dirname, 'demo');
    const demos = await fs.readdir(demosdir);

    const list = await Promise.all(demos.map(async demodir => {
      const coverExsit = await fs.exists(
        path.join(demosdir, demodir, 'cover.png')
      );

      let pkg = {
        name: demodir,
        // eslint-disable-next-line
        cn_name: demodir,
        description: demodir,
        // eslint-disable-next-line
        cn_description: demodir,
        cover: coverExsit ? `/${demodir}/cover.png` : 'https://s3.ax1x.com/2021/02/13/yrjkOH.jpg'
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

    return res.send(list);
  });

  app.get('/:demo/files.json', async (req, res) => {
    const demo = req.params.demo;

    const files = await fs.readdir(path.join(__dirname, 'demo', demo));

    const json = await Promise.all(files.map(async file => {
      let code = (await fs.readFile(
        path.join(__dirname, 'demo', demo, file)
      )).toString();

      return {
        filename: file,
        code: code
      };
    }));

    return res.send(json);
  });
};
