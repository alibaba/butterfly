# Plugins

## panel

### 用法

``` js
import panelPlugins from '../../dist/index.js';
import pika from '../img/pikatest.jpg';
import '../../dist/index.css';

panelPlugins.register(
  [
    {
      root: document.getElementById('dnd'),
      canvas: this.canvas,
      type: 'uml',
      width: 40,
      height: 40,
      data: [
        {
          id: 'user-1',
          type: 'png',
          content: pika,
          with: 40,
          height: 40,
        }
      ]
    },
  ],() => {
    console.log('finish')
  }
);

```

### 属性

#### root  _`<dom>`_    (必填)
&nbsp;&nbsp;`panel`渲染的`dom`节点

#### canvas  _`<Object>`_    (必填)
&nbsp;&nbsp;`butterfly-dag`的`canvas`

#### type  _`<String>`_    (选填)
&nbsp;&nbsp;使用那个内置的`panel`库

#### width  _`<Number>`_    (选填)
&nbsp;&nbsp;在`root`里渲染的`type`中的每个`panel`的宽度,默认`36`

#### height  _`<Number>`_    (选填)
&nbsp;&nbsp;在`root`里渲染的`type`中的每个`panel`的宽度,默认`36`

#### data  _`<Array>`_    (选填)
&nbsp;&nbsp;自定义的`panel`,会追加在最后:自定义`panel`配置主要为：

* id _`<String>`_ (必填)用于添加进画布是的id前缀

* content _`<img>`_ (必填)`panel`中填充的图片

* type _`<String>`_ (选填)后续内容，用于标示图片的类型

* width _`<Number>`_ (选填)在`root`中渲染的自定义`panel`的宽度,默认`36`

* height _`<Number>`_ (选填)在`root`中渲染的自定义`panel`的高度,默认`36`

### API

#### panelPlugins.register(data, callback)

*作用*：注册`panel`到`root`中

*参数*

* `{Array} data` 里面包含`panel`数据
* `{function} calllback`（可选） 注册完毕后的回调

``` js
panelPlugins.register(
  [
    {
      root: document.getElementById('dnd'),
      canvas: this.canvas,
      type: 'uml',
    }
  ]
);
```