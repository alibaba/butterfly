<p align="center">
  <a href="http://noonnightstorm.github.io">
    <img width="900" src="http://img.alicdn.com/tfs/TB1TlngGFYqK1RjSZLeXXbXppXa-844-474.png">
  </a>
</p>

<h3 align="center">一个基于JS的数据驱动的节点式编排组件库</h3>

<div align="center">

[![Build Status](https://dev.azure.com/noonnightstorm/butterfly/_apis/build/status/alibaba.butterfly?branchName=master)](https://dev.azure.com/noonnightstorm/butterfly/_build/latest?definitionId=1&branchName=master)
[![CircleCI](https://img.shields.io/circleci/project/github/alibaba/butterfly/master.svg?style=flat-square)](https://circleci.com/gh/alibaba/butterfly)
[![npm package](https://img.shields.io/npm/v/butterfly-dag.svg?style=flat-square)](https://www.npmjs.org/package/butterfly-dag)
[![NPM downloads](http://img.shields.io/npm/dm/butterfly-dag.svg?style=flat-square)](http://npmjs.com/butterfly-dag)
[![Dependencies](https://img.shields.io/david/alibaba/butterfly.svg?style=flat-square)](https://david-dm.org/alibaba/butterfly)
[![DevDependencies](https://img.shields.io/david/dev/alibaba/butterfly.svg?style=flat-square)](https://david-dm.org/alibaba/butterfly?type=dev)


</div>

[English](./README.en-US.md) | 简体中文

## ✨ 特性
* 开箱即用的参考[DEMO](https://noonnightstorm.github.io/)，可在线调试
* 全方位管理画布，开发者只需要更专注定制化的需求
* 利用dom来定制元素；灵活性，可塑性，拓展性优秀

<p align="center">
  <img width="900" src="https://img.alicdn.com/tfs/TB1mwr0gbr1gK0jSZFDXXb9yVXa-1000-1000.png">
</p>

## 📦 安装
```
npm install butterfly-dag
```

## 🔨 快速上手

### 引入样式
```
require('butterfly-dag/dist/index.css');
// or
import 'butterfly-dag/dist/index.css';
```

### 生成画布
```
const Canvas = require('butterfly-dag').Canvas;
let canvas = new Canvas({
  root: dom,              //canvas的根节点(必传)
  zoomable: true,         //可缩放(可传)
  moveable: true,         //可平移(可传)
  draggable: true,        //节点可拖动(可传)
});
canvas.draw({
  groups: [],  //分组信息
  nodes: [],  //节点信息
  edges: []  // 连线信息
})
```

### 定制元素(节点组，节点，线，锚点)
```
// 定制节点
const Node = require('butterfly-dag').Node;
class ANode extend Node {
  draw() {
    // 这里定制您需要的节点并返回一个dom
    let div = document.createElement("div"); 
    div.innerHTML = 'helloworld';
    return div
  }
}

// 定制节点组
const Group = require('butterfly-dag').Group;
class AGroup extend Group {
  draw() {
    // 这里定制您需要的节点组并返回一个dom
    let container = document.createElement("div"); 
    container.className = 'container';
    let title = document.createElement('p');
    title.innerHTML = 'group name'
    container.appendChild(title);
    return container;
  }
}

// 线，锚点如此类推，请看具体文档
```

## 🔗 API文档
* [画布(canvas)](./docs/zh-CN/canvas.md)
* [节点组(group)](./docs/zh-CN/group.md)
* [节点(node)](./docs/zh-CN/node.md)
* [线(edge)](./docs/zh-CN/edge.md)
* [锚点(endpoint)](./docs/zh-CN/endpoint.md)
* [缩略图(minimap)](./docs/zh-CN/minimap.md)


## 快速本地DEMO
```
cd example
npm install
npm start
```

## 🤝贡献
小蝴蝶是一个完全开源的项目，我们欢迎大家为修复错误和改进做出贡献。有关如何开始的信息，请阅读我们的[贡献指南](./docs/zh-CN/CONTRIBUTING.md).
