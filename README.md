<p align="center">
  <a href="http://noonnightstorm.github.io">
    <img width="200" src="http://img.alicdn.com/tfs/TB1cHHLFMDqK1RjSZSyXXaxEVXa-116-88.png">
  </a>
</p>

<h1 align="center">小蝴蝶</h1>

<div align="center">
  <h3>一个基于JS的数据驱动的节点式编排组件库</h3>
</div>

## 特性
* 开箱即用的参考[DEMO](https://noonnightstorm.github.io/)，可在线调试
* 全方位管理全画布，开发者只需要更专注定制化的需求
* 灵活性，可塑性，拓展性比较强

## 安装
```
npm install butterfly-dag
```

## 快速上手

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
    div.innerHTML('helloworld');
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

## API文档
* [画布(canvas)](https://github.com/alibaba/butterfly/blob/master/docs/canvas.md)
* [节点组(group)](https://github.com/alibaba/butterfly/blob/master/docs/group.md)
* [节点(node)](https://github.com/alibaba/butterfly/blob/master/docs/node.md)
* [线(edge)](https://github.com/alibaba/butterfly/blob/master/docs/edge.md)
* [锚点(endpoint)](https://github.com/alibaba/butterfly/blob/master/docs/endpoint.md)
