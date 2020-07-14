<p align="center">
  <a href="http://noonnightstorm.github.io">
    <!-- <img width="900" src="http://img.alicdn.com/tfs/TB1TlngGFYqK1RjSZLeXXbXppXa-844-474.png"> -->
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

English | [简体中文](./README.md)

## ✨ Features
* Simple & Poweful & Rich DEMO
* Manage the canvas in all aspects, developers only need to focus more on customized needs
* Use dom to customize elements: flexibility and excellent expandability

<p align="center">
  <img width="900" src="https://img.alicdn.com/tfs/TB1nq6hCeT2gK0jSZFvXXXnFXXa-1200-2660.png">
</p>

## QUCIK DEMO LOCAL
```
git clone git@github.com:alibaba/butterfly.git
npm install
cd example
npm install
npm start
```

## 📦 Install
```
npm install butterfly-dag
```

## 🔨 Quick Start

### Import Method
```
// Full version, including jQuery and lodash internally
import {Canvas, Group, Node, Edge} from 'butterfly-dag';
import 'butterfly-dag/dist/index.css';

// If your project uses jQuery and lodash, in order to reduce the size of the project, we suggest:
import {Canvas, Group, Node, Edge} from 'butterfly-dag/pack/index.js';
import 'butterfly-dag/pack/index.css';
```

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

## 🔗 API Document

* [Canvas](./docs/en-US/canvas.md)
  * [attribute](./docs/en-US/canvas.md#canvas-attr)
  * [get, add and delete node，edge，group](./docs/en-US/canvas.md#canvas-api-crud)
  * [zoom and move canvas](./docs/en-US/canvas.md#canvas-api-zoom-move)
  * [fit canvas and focus part nodes](./docs/en-US/canvas.md#canvas-api-focus)
  * [redo, undo](./docs/en-US/canvas.md#canvas-api-redo-undo)
  * [coordinate conversion and offset](./docs/en-US/canvas.md#canvas-api-coordinate)
  * [mutiply selection](./docs/en-US/canvas.md#canvas-api-selected)
  * [events](./docs/en-US/canvas.md#canvas-api-events)
  * [other api](./docs/en-US/canvas.md#canvas-api-other)
* [Group](./docs/en-US/group.md)
  * [attribute](./docs/en-US/group.md#group-attr)
  * [custom group](./docs/en-US/group.md#group-custom)
  * [add and delete members](./docs/en-US/group.md#group-member)
  * [custom endpoint](./docs/en-US/group.md#group-endpoint)
  * [move group](./docs/en-US/group.md#group-move)
  * [events](./docs/en-US/group.md#group-event)
* [Node](./docs/en-US/node.md)
  * [attribute](./docs/en-US/node.md#node-attr)
  * [custom node](./docs/en-US/node.md#node-custom)
  * [custom endpoint](./docs/en-US/node.md#node-endpoint)
  * [move node](./docs/en-US/node.md#node-move)
  * [events](./docs/en-US/node.md#node-event)
  * [[tree layout] collapse and expand sub node]()
* [Edge](./docs/en-US/edge.md)
  * [attribute](./docs/en-US/edge.md#edge-attr)
  * [custom edge](./docs/en-US/edge.md#edge-custom-dom)
  * [custom arrow](./docs/en-US/edge.md#edge-custom-arrow)
  * [custom label](./docs/en-US/edge.md#edge-custom-label)
  * [edge connectivity](./docs/en-US/edge.md#edge-isConnect)
  * [events](./docs/en-US/edge.md#edge-event)
  * [animation](./docs/en-US/edge.md#edge-animation)
* [Endpoint](./docs/en-US/endpoint.md)
  * [attribute](./docs/en-US/endpoint.md#endpoint-attr)
  * [API](./docs/en-US/endpoint.md#endpoint-api)
* [Minimap](./docs/en-US/minimap.md#endpoint-api)
* [Layout(doing)]()

## 🤝 Contribution
Butterfly is a completely open source project and we welcome everyone to contribute to fixing bugs and improvements. For information on how to get started, read our [contribution guide](./docs/en-US/CONTRIBUTING.md).
