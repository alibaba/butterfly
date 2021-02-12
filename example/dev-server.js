const fs = require('fs-extra');
const path = require('path');

const colorTheme = fs.readFileSync(
  path.join(__dirname, 'colorVariable.less')
).toString();


module.exports = (app) => {
  app.get('/list.json', async (req, res) => {
    const demosdir = path.join(__dirname, 'demo');
    const demos = await fs.readdir(demosdir);

    const list = await Promise.all(demos.map(async demodir => {
      let pkg = {
        name: demodir,
        cn_name: demodir,
        description: demodir,
        cn_description: demodir
      };

      try {
        pkg = JSON.parse(
          (await fs.readFile(
            path.join(__dirname, demodir, 'package.json')
          )).toString()
        )
      } catch (e) {
        return pkg;
      }
    }));

    return res.send(list);
  });

  app.get('/:demo/package.json', (req, res) => {

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
}