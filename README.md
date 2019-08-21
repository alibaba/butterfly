<p align="center">
  <a href="http://noonnightstorm.github.io">
    <img width="900" src="http://img.alicdn.com/tfs/TB1TlngGFYqK1RjSZLeXXbXppXa-844-474.png">
  </a>
</p>

<h3 align="center">JavaScript Diagramming library which concentrate on flow layout canvas</h3>

<div align="center">

[![Build Status](https://dev.azure.com/noonnightstorm/butterfly/_apis/build/status/alibaba.butterfly?branchName=master)](https://dev.azure.com/noonnightstorm/butterfly/_build/latest?definitionId=1&branchName=master)
[![CircleCI](https://img.shields.io/circleci/project/github/alibaba/butterfly/master.svg?style=flat-square)](https://circleci.com/gh/alibaba/butterfly)
[![npm package](https://img.shields.io/npm/v/butterfly-dag.svg?style=flat-square)](https://www.npmjs.org/package/butterfly-dag)
[![NPM downloads](http://img.shields.io/npm/dm/butterfly-dag.svg?style=flat-square)](http://npmjs.com/butterfly-dag)
[![Dependencies](https://img.shields.io/david/alibaba/butterfly.svg?style=flat-square)](https://david-dm.org/alibaba/butterfly)
[![DevDependencies](https://img.shields.io/david/dev/alibaba/butterfly.svg?style=flat-square)](https://david-dm.org/alibaba/butterfly?type=dev)


</div>

English | [简体中文](./README-zh_CN.md)

## ✨ Features
* Simple & Poweful. [Online DEMO](https://noonnightstorm.github.io/)
* Manage the canvas in all aspects, developers only need to focus more on customized needs
* Use dom to customize elements: flexibility and excellent expandability

## 📦 Install
```
npm install butterfly-dag
```

## 🔨 Quick Start

### Create Canvas
```
const Canvas = require('butterfly-dag').Canvas;
let canvas = new Canvas({
  root: dom,              //canvas root dom (require)
  zoomable: true,         //enable zoom canvas (option)
  moveable: true,         //enable move canvas (option)
  draggable: true,        //enbale drag nodes (options)
});
canvas.draw({
  groups: [],  // group  data
  nodes: [],  // nodes data
  edges: []  // edges data
})
```

### Custom Item(Group，Node，Edge，Endpoint)
```
// Custom Node
const Node = require('butterfly-dag').Node;
class ANode extend Node {
  draw() {
    // Here you can customize the node as you wish , but remember return it`s root dom
    let div = document.createElement("div"); 
    div.innerHTML('helloworld');
    return div
  }
}

// Custom Group
const Group = require('butterfly-dag').Group;
class AGroup extend Group {
  draw() {
    // Here you can customize the node as you wish , but remember return it`s root dom
    let container = document.createElement("div"); 
    container.className = 'container';
    let title = document.createElement('p');
    title.innerHTML = 'group name'
    container.appendChild(title);
    return container;
  }
}

// Edge、Endpoint and so on . Please see the detail document
```

## 🔗 API Document
* [Canvas](https://github.com/alibaba/butterfly/blob/master/docs/en-US/canvas.md)
* [Group](https://github.com/alibaba/butterfly/blob/master/docs/en-US/group.md)
* [Node](https://github.com/alibaba/butterfly/blob/master/docs/en-US/node.md)
* [Edge](https://github.com/alibaba/butterfly/blob/master/docs/en-US/edge.md)
* [Endpoint](https://github.com/alibaba/butterfly/blob/master/docs/en-US/endpoint.md)
* [Minimap](https://github.com/alibaba/butterfly/blob/master/docs/en-US/minimap.md)

## 🤝 Contribution
Butterfly is a completely open source project and we welcome everyone to contribute to fixing bugs and improvements. For information on how to get started, read our [contribution guide](https://github.com/alibaba/butterfly/blob/master/docs/en-US/CONTRIBUTING.md).
