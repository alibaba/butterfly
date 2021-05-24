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

![uml-detail](https://img.alicdn.com/imgextra/i2/O1CN01lamW4d24oCDdkb88Z_!!6000000007437-2-tps-1418-678.png)

*the file name is id*：such as： `System-Uml-ClassDiagram-1`

#### System General Module

![basic-detail](https://img.alicdn.com/imgextra/i1/O1CN01aFWWuR1ZtSga2X8vm_!!6000000003252-2-tps-1418-333.png)

*the file name is id*：such as： `System-Basic-1`

### Attribute

#### root  _`<dom>`_    (Require)
&nbsp;&nbsp;the container for `pannel` rendering `dom`

#### canvas  _`<Object>`_    (Require)
&nbsp;&nbsp;the `canvas` instance of `butterfly-dag`

#### type  _`<String>`_    (Optional)
&nbsp;&nbsp;System 'panel' library type: `uml` or `basic`

#### width  _`<Number>`_    (Optional)
&nbsp;&nbsp;render the width of the element in the root container. Default value `36`

#### height  _`<Number>`_    (Optional)
&nbsp;&nbsp;render the height of the element in the root container. Default value `36`

#### data  _`<Array>`_    (Optional)
&nbsp;&nbsp;custom `panel`, it will append to the bottom of root; configuration :

* id _`<String>`_ (Require) unique id used to add to the canvas and uesd to id prefix; (note: do not duplicate with the system itself)

* content _`<String>`_ (Require) the content of `PanelNode`(`<img src="content" />` or System picture of `ID`)

* type _`<String>`_ (Optional) content type,  types used to mark images

* width _`<Number>`_ (Optional) render the width of the element in the root container. Default value `36`

* height _`<Number>`_ (Optional) render the height of the element in the root container. Default value `36`

### API

#### panelPlugins.register(data, callback)

*descripition*：register `panel` to `root`

*params*

* `{Array} data` 里面包含`panel`数据
* `{function} calllback`（可选） 注册完毕后的回调

``` js

// Use System uml theme
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

// Custom
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

// combination
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
      type: 'custom',
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

### PanelNode

* Extend `Node` from `butterfly-dag`

#### attribute

##### actived  _`<Boolean>`_ 
&nbsp;&nbsp; controls whether the state is activated (activates the control point displaying the node)

##### rotatorDeg _`<Number>`_ 
&nbsp;&nbsp; rotation angle of current node

#### API

##### panelNode.focus ()

*descripition*： node becomes selected

```js
panelNode.focus();
```

##### panelNode.unfocus ()

*descripition*： Node becomes unselected

```js
panelNode.unfocus();
```

##### panelNode.rotate (angle)

*descripition*： rotate the node

*params*

* `angle `_`<Number>`_ set the rotation angle of the node (clockwise)

```js
panelNode.rotate(45);
```
