const {JSDOM} = require('jsdom');
const styleRegister = require('ignore-styles');
const bableRegister = require('@babel/register');

// 注册jsdom，创建前端虚拟环境
const dom = new JSDOM('<!DOCTYPE html><body><div id="root"></div></body>');
global.window = dom.window;
global.document = dom.window.document;

const babelrc = {
  "presets": ["@babel/preset-env"],
  "plugins": [
    "@babel/plugin-proposal-class-properties"
  ]
};

// 支持es6语法
bableRegister(babelrc);

// 忽略less/css
styleRegister.default(['.less', '.css']);