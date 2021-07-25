# React版小蝴蝶（butterfly-react）

## 安装

```bash
$ npm i butterfly-react butterfly-dag -S
```

## 用法

请参考 [React Demo](https://butterfly-dag.gitee.io/butterfly-dag/demo/react)

## 属性

| Prop | 类型 | 说明 | 默认值 |
| --- | --- | --- | --- |
| nodes | INode[] (定义放下看) | | []|
| egdes | IEdge[] (定义往下看) | | [] |
| groups | IGroup[] (定义往下看) |   | [] |
| options | Object | 参考官网[定义](https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/canvas.md#canvas-attr) | | |
| onEdgesChange | (IEdge[]) => void; | | |
| onCreateEdge | (IEdge) => void; | | |
| onReconnectEdge | (res(同原生重连返回参数)) => void; | 当线从一个锚点拖拽到新的锚点时触发| |
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
