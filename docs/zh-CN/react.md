# React版小蝴蝶（butterfly-react）

## 安装

```bash
$ npm i butterfly-react butterfly-dag -S
```

## 用法

```jsx
import React from 'react';
import ReactButterfly from 'butterfly-react';

const endpoints = [
  {
    id: 'right',
    orientation: [1, 0],
    pos: [0, 0.5]
  },
  {
    id: 'left',
    orientation: [-1, 0],
    pos: [0, 0.5]
  }
];

const data = {
  groups: [
    {
      id: '1',
      left: 10,
      top: 100,
      render() {
        return (
          <div style={{width:'250px',textAlign:'center',backgroundColor:'blanchedalmond'}}>
            测试group
          </div>
        )
      }
    }
  ],
  nodes: [
    {
      id: '1',
      group:'1',
      endpoints: endpoints,
      render() {
        return (
          <div>
            测试节点1
          </div>
        );
      }
    },
    {
      id: '2',
      top: 25,
      left: 300,
      endpoints: endpoints,
      render() {
        return (
          <div>
            测试节点2
          </div>
        );
      }
    },
    {
      id: '3',
      top: 25,
      left: 600,
      endpoints: endpoints,
    }
  ],
  edges: [
    {
      id: '1-2',
      sourceNode: '1',
      targetNode: '2',
      source: 'right',
      target: 'left',
      labelRender: () => {
        return '测试label';
      }
    }
  ],
};

class App extends React.Component {
  state = {
    data
  }

  render() {
    return (
      <div>
        <ReactButterfly {...this.state.data} />
      </div>
    );
  }
}
```

## 属性

| Prop | 类型 | 说明 | 默认值 |
| --- | --- | --- | --- |
| nodes | INode[] (定义放下看) | | []|
| egdes | IEdge[] (定义往下看) | | [] |
| groups | IGroup[] (定义往下看) |   | [] |
| options | Object | 参考官网[定义](https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/canvas.md#canvas-attr) | | |
| onEdgesChange | (IEdge[]) => void; | | |
| onCreateEdge | (IEdge) => void; | | |
| onDeleteEdge | (IEdge) => void; | | |
| className | String | | |
| onLoaded | (canvas) => void; | 画布加载完毕后返回画布实例| |



```ts
  interface INode {
    id: string | number;          // 推荐string
    render: () => JSX.Element;    // 自定义渲染函数
    // ... 上述为必填属性， 其他属性参考官网https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/node.md#node-attr
  }

  interface IEdge {
    id: string | number;         // 推荐 string
    labelRender?: () => JSX.ESLint; // 自定义label渲染函数，可不填
    // ...其他属性参考官方https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/edge.md
  }

  interface IGroup {
    id: string | number;
  }
```
