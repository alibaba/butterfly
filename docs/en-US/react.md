# butterfly-react

## Install

Using npm:

``` bash
$ npm i butterfly-react butterfly-dag -S
```

## Usage

``` jsx
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
            group
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
            node1
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
            node2
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
        return 'label';
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

| Prop          | Type                | Description                                                                              | Default |
|---------------|---------------------|------------------------------------------------------------------------------------------|---------|
| nodes         | [INode[]](#INode)   |                                                                                          | []      |
| egdes         | [IEdge[]](#IEdge)   |                                                                                          | []      |
| groups        | [IGroup[]](#IGroup) |                                                                                          | []      |
| options       | Object              | [see](https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/canvas.md#canvas-attr) |         |
| onEdgesChange | (IEdge[]) => void; |                                                                                          |         |
| onCreateEdge  | (IEdge) => void; |                                                                                          |         |
| onDeleteEdge  | (IEdge) => void; |                                                                                          |         |
| className     | String              |                                                                                          |         |
| onLoaded      | (canvas) => void; | Canvans onLoaded event                                                                   |         |

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
