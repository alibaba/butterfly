<p align="center">
  <a href="http://noonnightstorm.github.io">
    <!-- <img width="900" src="http://img.alicdn.com/tfs/TB1TlngGFYqK1RjSZLeXXbXppXa-844-474.png"> -->
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
* 丰富DEMO，开箱即用
* 全方位管理画布，开发者只需要更专注定制化的需求
* 利用dom来定制元素；灵活性，可塑性，拓展性优秀

<p align="center">
  <img width="900" src="https://img.alicdn.com/tfs/TB1nq6hCeT2gK0jSZFvXXXnFXXa-1200-2660.png">
</p>

## 快速本地DEMO
```
git clone git@github.com:alibaba/butterfly.git
npm install
cd example
npm install
npm start
```

## 📦 安装
```
npm install butterfly-dag
```

## 🔨 快速上手

### 引入方式
```
// 完全版，内部包含jquery和lodash
import {Canvas, Group, Node, Edge} from 'butterfly-dag';
import 'butterfly-dag/dist/index.css';

// 如果您引用的项目使用了jquery和lodash，为了缩小项目的体积，我们建议：
import {Canvas, Group, Node, Edge} from 'butterfly-dag/pack/index.js';
import 'butterfly-dag/pack/index.css';
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

## 🔗 API文档
* [画布(Canvas)](./docs/zh-CN/canvas.md)
  * [属性配置](./docs/zh-CN/canvas.md#canvas-attr)
  * [节点，线段，节点组的查看,新增,删除](./docs/zh-CN/canvas.md#canvas-api-crud)
  * [缩放，平移](./docs/zh-CN/canvas.md#canvas-api-zoom-move)
  * [适配画布和聚焦局部节点](./docs/zh-CN/canvas.md#canvas-api-focus)
  * [重做和撤销](./docs/zh-CN/canvas.md#canvas-api-redo-undo)
  * [坐标转换和坐标偏移](./docs/zh-CN/canvas.md#canvas-api-coordinate)
  * [框选](./docs/zh-CN/canvas.md#canvas-api-selected)
  * [事件](./docs/zh-CN/canvas.md#canvas-api-events)
  * [其他辅助方法](./docs/zh-CN/canvas.md#canvas-api-other)
* [节点组(Group)](./docs/zh-CN/group.md)
  * [属性配置](./docs/zh-CN/group.md#group-attr)
  * [自定义节点组](./docs/zh-CN/group.md#group-custom)
  * [新增，删除成员节点](./docs/zh-CN/group.md#group-member)
  * [自定义锚点](./docs/zh-CN/group.md#group-endpoint)
  * [移动](./docs/zh-CN/group.md#group-move)
  * [事件](./docs/zh-CN/group.md#group-event)
* [节点(Node)](./docs/zh-CN/node.md)
  * [属性配置](./docs/zh-CN/node.md#node-attr)
  * [自定义节点](./docs/zh-CN/node.md#node-custom)
  * [自定义锚点](./docs/zh-CN/node.md#node-endpoint)
  * [移动](./docs/zh-CN/node.md#node-move)
  * [事件](./docs/zh-CN/node.md#node-event)
  * [[树状布局] 收缩 & 展开子节点](./docs/zh-CN/node.md#node-collapse)
* [线(Edge)](./docs/zh-CN/edge.md)
  * [属性配置](./docs/zh-CN/edge.md#edge-attr)
  * [自定义线段](./docs/zh-CN/edge.md#edge-custom-dom)
  * [自定义箭头](./docs/zh-CN/edge.md#edge-custom-arrow)
  * [自定义label](./docs/zh-CN/edge.md#edge-custom-label)
  * [线段连通性](./docs/zh-CN/edge.md#edge-isConnect)
  * [事件](./docs/zh-CN/edge.md#edge-event)
  * [线段动画](./docs/zh-CN/edge.md#edge-animation)
* [锚点(Endpoint)](./docs/zh-CN/endpoint.md)
  * [属性配置](./docs/zh-CN/endpoint.md#endpoint-attr)
  * [通用API](./docs/zh-CN/endpoint.md#endpoint-api)
* [缩略图(Minimap)](./docs/zh-CN/minimap.md#endpoint-api)
* [布局(Layout)](./docs/zh-CN/layout.md)


## 🤝贡献
小蝴蝶是一个完全开源的项目，我们欢迎大家为修复错误和改进做出贡献。有关如何开始的信息，请阅读我们的[贡献指南](./docs/zh-CN/CONTRIBUTING.md).
