# 箭头(Arrow)

## 自定义箭头

### 注册箭头类型

```js
import {Arrow} from 'butterfly-dag';
Arrow.registerArrow([{
  key: 'yourArrow1',
  type: 'svg',
  width: 10,   // 选填，默认8px
  height: 10,  // 选填，默认8px
  content: require('/your_fold/your_arrow.svg') // 引用外部svg
}, {
  key: 'yourArrow1',
  type: 'pathString',
  content: 'M5 0 L0 -2 Q 1.0 0 0 2 Z' // path的d属性
}]);

```

### 使用箭头
```js
// 方法一：默认主题设置，所有箭头都会生效
let canvas = new Canvas({
  theme: {
    edge: {
      arrow: true,
      arrowShapeType: 'yourArrow1'
    }
  }
});

// 方法二：设置某条线段的箭头样式
canvas.addEdge({
  id: '',
  arrow: true,
  arrowShapeType: 'yourArrow1',
  ...
})
```

### 系统内置箭头

<img width="600" src="https://img.alicdn.com/imgextra/i1/O1CN01aFWWuR1ZtSga2X8vm_!!6000000003252-2-tps-1418-333.png">

### 外部引入箭头

&nbsp;&nbsp;&nbsp;&nbsp;用户注册svg或者是自定写path的箭头，此外，我们已经支持iconfont下载的svg可以作为箭头的样式，iconfont或者是你的不错的选择。