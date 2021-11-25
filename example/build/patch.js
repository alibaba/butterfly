const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(
  path.join(__dirname, '..', 'dist')
);

const htmlFilepath = path.join(__dirname, '..', 'dist', 'index.html');
const html404Filepath = path.join(__dirname, '..', 'dist', '404.html');
let html = fs.readFileSync(htmlFilepath).toString();

const main = files.filter(file => file.startsWith('app') && file.endsWith('.js'));

html = html.replace('app.js', main);

fs.writeFileSync(htmlFilepath, html);
fs.writeFileSync(html404Filepath, html);
