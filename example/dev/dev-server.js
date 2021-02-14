const fs = require('fs-extra');
const path = require('path');

const {
  DEFAULT_IMG,
  getDemoList,
  getDemoFiles
} = require('./util');

module.exports = (app) => {
  app.get('/list.json', async (req, res) => {
    const list = await getDemoList();
    return res.send(list);
  });

  app.get('/:demo/files.json', async (req, res) => {
    const demo = req.params.demo;

    const json = await getDemoFiles(demo);

    return res.send(json);
  });

  app.get('/:demo/cover.png', async (req, res) => {
    const demo = req.params.demo;

    const pngpath = path.join(__dirname, '..', 'demo', demo, 'cover.png');

    try {
      const buffer = await fs.readFile(pngpath);

      res.write(buffer);
      return res.end();
    } catch (e) {
      return res.redirect(DEFAULT_IMG);
    }
  });
};
