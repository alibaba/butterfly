# Plugins

## panel

### Install

```
npm install butterfly-dag butterfly-plugins-panel
```

### Usage

#### Resigter

``` js
import {panelPlugins} from 'butterfly-dag/plugins';
import 'butterfly-dag/plugins/dist/index.css';

import pika from '../img/pikatest.jpg';

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
        },
        {
          id: 'user-baidu-1',
          type: 'png',
          content: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
          with: 100,
          height: 40,
        }
      ]
    },
  ],() => {
    console.log('finish')
  }
);

```

#### Iitialization

``` JS
import panelPlugins from 'butterfly-dag/plugins';
import {Canvas} from 'butterfly-dag';

import pika from '../img/pikatest.jpg';

let PanelNode = panelPlugins.PanelNode;

let root = document.getElementById('dag-canvas');

this.canvas = new BaseCanvas({
  root: root,
  disLinkable: true, // enable disConnect edge
  linkable: true,    // enable connect edges
  draggable: true,   // enable drag nodes
  zoomable: true,    // enable zoom canvas
  moveable: true,    // enable move canvas
});

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
        },
        {
          id: 'user-baidu-1',
          type: 'png',
          content: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
          with: 100,
          height: 40,
        }
      ]
    },
  ],() => {
    console.log('finish')
  }
);

this.canvas.draw(
  {
    nodes: [{
      id: '1',
      top: 10,
      left: 100,
      width: 40,
      height: 40,
      rotate: 45,
      content: 'System-Uml-ClassDiagram-1',
      Class: PanelNode,
    },{
      id: '2',
      top: 10,
      left: 20,
      width: 40,
      height: 40,
      rotate: 30,
      content: 'user-baidu-1',
      Class: PanelNode,
    }]
  },
  () => {
    console.log(this.canvas.getDataMap());
});

```

``` JS
// Use System UML picture (System 'UML' picture 'ID')

this.canvas.draw(
  {
    nodes: [{
      id: '1',
      top: 10,
      left: 20,
      content: 'System-Uml-ClassDiagram-1',
      Class: PanelNode,
    }]
  }
);

// Method 1 (recommended): use custom
// The initialization here can use the previously registered ID as the content

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

this.canvas.draw(
  {
    nodes: [{
      id: '1',
      top: 10,
      left: 20,
      content: 'user-1',
      Class: PanelNode,
    }]
  }
);

// Method 2: use custom

this.canvas.draw(
  {
    nodes: [{
      id: '1',
      top: 10,
      left: 20,
      content: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
      Class: PanelNode,
    }]
  }
);

// Method 3: use custom

import pika from '../img/pikatest.jpg';

this.canvas.draw(
  {
    nodes: [{
      id: '1',
      top: 10,
      left: 20,
      content: pika,
      Class: PanelNode,
    }]
  }
);

```

### System Module

#### System UML Module

![uml-detail](https://img.alicdn.com/imgextra/i2/O1CN014BUVCs1v1npUkWAb8_!!6000000006113-2-tps-500-415.png)

*the file name is id*：such as： `System-Uml-ClassDiagram-1`

#### System General Module

![basic-detail](https://img.alicdn.com/imgextra/i1/O1CN01pRT4Iu1rkRyYUlIeD_!!6000000005669-2-tps-656-228.png)

*the file name is id*：such as： `System-Basic-1`

### Attribute

#### root  _`<dom>`_    (Require)
&nbsp;&nbsp;the container for `pannel` rendering `dom`

#### canvas  _`<Object>`_    (Require)
&nbsp;&nbsp;the `canvas` instance of `butterfly-dag`

#### type  _`<String>`_    (Optional)
&nbsp;&nbsp;System 'panel' library type: `uml` or `basic`

#### width  _`<Number>`_    (Optional)
&nbsp;&nbsp;render the width of the element in the root container. Default value ` 36`

#### height  _`<Number>`_    (Optional)
&nbsp;&nbsp;render the height of the element in the root container. Default value ` 36`

#### data  _`<Array>`_    (Optional)
&nbsp;&nbsp;自定义的`panel`,会追加在最后:自定义`panel`配置主要为：

* id _`<String>`_ (Require) 用于添加进画布是的id前缀、唯一标识（不要和系统自带的重复）

* content _`<String>`_ (Require) `PanelNode`中填充的图片(`<img src="content" />` | 内置主题图片`ID`)

* type _`<String>`_ (Optional) 后续内容，用于标示图片的类型

* width _`<Number>`_ (Optional) 在`root`中渲染的自定义`panel`的宽度,默认`36`

* height _`<Number>`_ (Optional) 在`root`中渲染的自定义`panel`的高度,默认`36`

### API

#### panelPlugins.register(data, callback)

*descripition*：注册`panel`到`root`中

*参数*

* `{Array} data` 里面包含`panel`数据
* `{function} calllback`（可选） 注册完毕后的回调

``` js
// 无自定义

panelPlugins.register(
  [
    {
      root: document.getElementById('dnd'),
      canvas: this.canvas,
      type: 'uml',
    }
  ],()=>{
    console.log('finish');
  }
);

// 有自定义

panelPlugins.register(
  [
    {
      root: document.getElementById('dnd'),
      canvas: this.canvas,
      type: 'uml',
      data: [
        {
          id: 'user-1',
          type: 'png',
          content: pika,
          with: 40,
          height: 40,
        }
      ]
    }
  ]
);

// 多组

panelPlugins.register(
  [
    {
      root: document.getElementById('dnd'),
      canvas: this.canvas,
      type: 'uml',
    },
    {
      root: document.getElementById('dnd1'),
      canvas: this.canvas,
      type: 'uml',
      data: [
        {
          id: 'user-1',
          type: 'png',
          content: pika,
          with: 40,
          height: 40,
        }
      ]
    }
  ]
);
```

### 节点（PanelNode）

* 继承自`butterfly-dag`的`Node`

#### 属性

##### actived  _`<Boolean>`_ 
&nbsp;&nbsp; 控制是否激活状态（激活显示node的控制点）

##### rotatorDeg _`<Number>`_ 
&nbsp;&nbsp; 当前节点的旋转角度

#### API

##### panelNode.focus ()

*descripition*： 节点变为未选中状态

```js
panelNode.focus();
```

##### panelNode.unfocus ()

*descripition*： 节点变为选中状态

```js
panelNode.unfocus();
```

##### panelNode.rotate (angle)

*descripition*： 节点旋转

*参数*

* `angle `_`<Number>`_ 设置节点的旋转角度（顺时针）

```js
panelNode.rotate(45);
```
