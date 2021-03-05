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
* Use DOM/REACT/VUE to customize elements: flexibility and excellent expandability

<p align="center">
  <img width="900" src="https://img.alicdn.com/imgextra/i4/O1CN01d7WHVs1vkEDzWRRlW_!!6000000006210-2-tps-2400-8172.png">
</p>

## 🚀QUCIK DEMO LOCAL
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
  * [other api(grid background, auxiliary line, save canvas as picture)](./docs/en-US/canvas.md#canvas-api-other)
* [Group](./docs/en-US/group.md)
  * [attribute](./docs/en-US/group.md#group-attr)
  * [custom group](./docs/en-US/group.md#group-custom)
  * [add and delete members](./docs/en-US/group.md#group-member)
  * [custom endpoint](./docs/en-US/group.md#group-endpoint)
  * [move group](./docs/en-US/group.md#group-move)
  * [emit/on events](./docs/en-US/group.md#group-event)
* [Node](./docs/en-US/node.md)
  * [attribute](./docs/en-US/node.md#node-attr)
  * [custom node](./docs/en-US/node.md#node-custom)
  * [custom endpoint](./docs/en-US/node.md#node-endpoint)
  * [move node](./docs/en-US/node.md#node-move)
  * [emit/on events](./docs/en-US/node.md#node-event)
  * [[tree layout] collapse and expand sub node](./docs/en-US/node.md#node-collapse)
* [Edge](./docs/en-US/edge.md)
  * [attribute](./docs/en-US/edge.md#edge-attr)
  * [custom edge](./docs/en-US/edge.md#edge-custom-dom)
  * [custom arrow](./docs/en-US/edge.md#edge-custom-arrow)
  * [custom label](./docs/en-US/edge.md#edge-custom-label)
  * [edge connectivity](./docs/en-US/edge.md#edge-isConnect)
  * [emit/on events](./docs/en-US/edge.md#edge-event)
  * [animation](./docs/en-US/edge.md#edge-animation)
* [Endpoint](./docs/en-US/endpoint.md)
  * [attribute](./docs/en-US/endpoint.md#endpoint-attr)
  * [API](./docs/en-US/endpoint.md#endpoint-api)
* [Minimap](./docs/en-US/minimap.md#endpoint-api)
* [Tooltips & Menu](./docs/en-US/tooltip.md)
* [Layout](./docs/en-US/layout.md)
* React & Vue Support
  * [React butterfly](./docs/en-US/react.md)
  * [Vue2 butterfly](./docs/en-US/vue.md)

## ⌨️Business-specific React Extension Components
* [Data/Table-Field mapping](https://github.com/aliyun/react-data-mapping/blob/master/README.en-US.md)
<p align="center">
  <img width="49%" src="https://img.alicdn.com/imgextra/i2/O1CN01O8w0tT26WuU5J6lty_!!6000000007670-1-tps-595-411.gif">
  <img width="49%" src="https://img.alicdn.com/imgextra/i2/O1CN017Gcu0Y1mbgIHcgqwr_!!6000000004973-1-tps-595-411.gif">
</p>
<p align="center">
  <img width="49%" src="https://img.alicdn.com/imgextra/i2/O1CN011xYzxM1ZenzfVE0Xq_!!6000000003220-1-tps-595-411.gif">
  <img width="49%" src="https://img.alicdn.com/imgextra/i4/O1CN01Nt9rpo25y6NlRMUtR_!!6000000007594-1-tps-595-411.gif">
</p>

* Blood Map(doing): Suitable for table blood dag, table field blood dag, business chain blood dag and other blood dag
<img width="98%" src="https://img.alicdn.com/imgextra/i4/O1CN01ou8wTq20SQv4AnedD_!!6000000006848-1-tps-1337-761.gif">

* (Visual Modeling)[https://github.com/aliyun/react-visual-modeling/blob/master/README.en-US.md]: Suitable for UML, database modeling, data warehouse construction
<img width="98%" src="https://img.alicdn.com/imgextra/i4/O1CN01VZxfyl1pOLc15k7XM_!!6000000005350-1-tps-1665-829.gif">

* Scheduling Diagram(doing)
* (Monitoring)[https://github.com/aliyun/react-monitor-dag/blob/master/README.en-US.md]: Suitable for the status display of task flow, data flow and other business
<img width="98%" src="https://img.alicdn.com/imgextra/i4/O1CN01tbmIry23xWea1YcBQ_!!6000000007322-1-tps-1665-829.gif">

* Butterfly-Editor(doing)

## 🤝 How to contribute
We welcome all contributors, please read the [Contribution Guide](./docs/en-US/CONTRIBUTING.md) before becoming a Contributor.

If you already know, come to [Issus](https://github.com/alibaba/butterfly/issues) or [Pull requests](https://github.com/alibaba/butterfly/pulls) to become contributors, and let's grow and be better and better together.

