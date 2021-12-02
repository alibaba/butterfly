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
* 利用DOM/REACT/VUE来定制元素；灵活性，可塑性，拓展性优秀

<p align="center">
  <img width="900" src="https://img.alicdn.com/imgextra/i3/O1CN018CrqXz1KRK7Euhj6X_!!6000000001160-2-tps-1155-1081.png">
</p>

## 🚀DEMO

### 本地DEMO

```
git clone git@github.com:alibaba/butterfly.git
npm install
cd example
npm install
npm start
```

### 线上DEMO

[小蝴蝶官网](https://butterfly-dag.gitee.io/butterfly-dag/demo/analysis)

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
import {Canvas} from 'butterfly-dag';
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
* *__!!! 3.x的API文档，请移步到__*[这里](https://github.com/alibaba/butterfly/blob/master/README.md);
* [画布(Canvas)](./docs/zh-CN/canvas.md)
* [节点组(Group)](./docs/zh-CN/group.md)
* [节点(Node)](./docs/zh-CN/node.md)
* [线(Edge)](./docs/zh-CN/edge.md)
* [锚点(Endpoint)](./docs/zh-CN/endpoint.md)
* [缩略图(Minimap)](./docs/zh-CN/minimap.md#endpoint-api)
* [提示 & 菜单(tooltips & menu)](./docs/zh-CN/tooltip.md)
* [布局(Layout)](./docs/zh-CN/layout.md)
* 插件
  * [箭头(arrow)](./docs/zh-CN/plugins-arrows.md)
  * [左侧画板(pannel)](./docs/zh-CN/plugins-pannel.md)
  * [快捷键(hotkey)](./docs/zh-CN/plugins-hotkey.md)
* React & Vue支持
  * [React butterfly组件支持](./docs/zh-CN/react.md)
  * [Vue2 butterfly组件支持](./docs/zh-CN/vue.md)

## 🎨优秀案例
<p align="center">
  <img width="900" src="https://img.alicdn.com/imgextra/i4/O1CN01d7WHVs1vkEDzWRRlW_!!6000000006210-2-tps-2400-8172.png">
</p>

## ⌨️垂直业务React拓展组件
* [数据/字段映射组件](https://github.com/aliyun/react-data-mapping): 适用于做数据字段映射，表字段映射，表格连线等业务
<p align="center">
  <img width="49%" src="https://img.alicdn.com/imgextra/i4/O1CN012ecl7n25IsnZeXw1d_!!6000000007504-1-tps-595-411.gif">
  <img width="49%" src="https://img.alicdn.com/imgextra/i2/O1CN017Gcu0Y1mbgIHcgqwr_!!6000000004973-1-tps-595-411.gif">
</p>
<p align="center">
  <img width="49%" src="https://img.alicdn.com/imgextra/i2/O1CN011xYzxM1ZenzfVE0Xq_!!6000000003220-1-tps-595-411.gif">
  <img width="49%" src="https://img.alicdn.com/imgextra/i4/O1CN01Nt9rpo25y6NlRMUtR_!!6000000007594-1-tps-595-411.gif">
</p>

* [表字段血缘/业务血缘](https://github.com/aliyun/react-lineage-dag): 适用于表级血缘,表字段级血缘,业务链路血缘等业务
<img width="98%" src="https://img.alicdn.com/imgextra/i4/O1CN01ou8wTq20SQv4AnedD_!!6000000006848-1-tps-1337-761.gif">

* [可视化建模图](https://github.com/aliyun/react-visual-modeling): 适用于UML，数据库建模，数据仓库建设等业务
<img width="98%" src="https://img.alicdn.com/imgextra/i4/O1CN01VZxfyl1pOLc15k7XM_!!6000000005350-1-tps-1665-829.gif">

* 调度编排图(doing)
* [监控图](https://github.com/aliyun/react-monitor-dag): 适用于任务流，数据流等业务的状态展示
<img width="98%" src="https://img.alicdn.com/imgextra/i2/O1CN01eJigoL1gd9tjRSvdi_!!6000000004164-1-tps-1665-826.gif">

* Butterfly-Editor(doing)

## 🤝如何贡献
我们欢迎所有的贡献者，在成为贡献者之前，请先阅读[贡献指南](./docs/zh-CN/CONTRIBUTING.md)。

如果您已经了解，快来[Issus](https://github.com/alibaba/butterfly/issues)或[Pull requests](https://github.com/alibaba/butterfly/pulls)成为贡献者吧，让我们和小蝴蝶一起成长，一起变得更好、更棒！
