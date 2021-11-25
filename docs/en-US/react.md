# butterfly-react

## Install

Using npm:

``` bash
$ npm i butterfly-react butterfly-dag -S
```

## Usage

please refer to [React Demo](https://butterfly-dag.gitee.io/butterfly-dag/demo/react)

## 属性

| Prop            | Type                | Description                                                                              | Default |
| --------------- | ------------------- | ---------------------------------------------------------------------------------------- | ------- |
| nodes           | [INode[]](#INode)   |                                                                                          | []      |
| egdes           | [IEdge[]](#IEdge)   |                                                                                          | []      |
| groups          | [IGroup[]](#IGroup) |                                                                                          | []      |
| options         | Object              | [see](https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/canvas.md#canvas-attr) |         |
| onEdgesChange   | (IEdge[]) => void;  |                                                                                          |         |
| onCreateEdge    | (IEdge) => void;    |                                                                                          |         |
| onReconnectEdge | (res) => void;      | Triggered when a line is dragged from an anchor to a new endpoint                        |         |
| onDeleteEdge    | (IEdge) => void;    |                                                                                          |         |
| className       | String              |                                                                                          |         |
| onLoaded        | (canvas) => void;   | Canvans onLoaded event                                                                   |         |

### res

* Same as the original(butterfly-dag) reconnection return parameter
* If you don't understand, you can `console.log`

### INode

``` ts
  interface INode {
    id: string | number;          // recommend string (require)
    render: () => JSX.Element;    // Custom render function (require)
    // Other Options see https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/node.md#node-attr
  }
```

### IEdge

``` ts
  interface IEdge {
    id: string | number;         // recommend string (require)
    labelRender?: () => JSX.ESLint; // Custom label render function (optional)
    // Other Options see https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/edge.md
  }
```

### IGroup

``` ts
  interface IGroup {
    id: string | number;
  }
```
