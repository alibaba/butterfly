# 介绍：
- 小蝴蝶的快捷键插件;
- 目前内置了全选，节点、线和group的删除，节点的复制和粘贴,redo，undo的功能;
- 可以在config中自定义快捷键，自定义快捷键功能会覆盖内置的快捷键；

# 使用方式
- 自定义的快捷键key参数现在只支持大写字母输入 例如请输入A不要输入a;
- 功能按键请采用驼峰方式书写，例如ctrl，leftArrow;

```js
import * as HotKeyPlugin from 'butterfly-dag/plugins/hotkey/dist/index.unpkg.js';

let canvasInstance = new Canvas({...});

HotKeyPlugin.register({
  canvas: this.canvasInstance,
  root:document,
  config:[{
    key: "ctrl+M",
    handler: () => {}
  },
  {
    key: 'A',
    handler: () => {}
  }]
})

```

# API
## Hotkey:

|  参数  |     说明    |                                     类型                                    | 默认值 |
|:------:|:-----------:|:---------------------------------------------------------------------------:|:-----:|
| canvas | 画布实例 |            object          |   {}   |
| root | 事件绑定的dom元素 |        Dom      |   {}   |
| config | 配置 见example |        Array      |   []   |


## 常见的方式和默认的功能
|  方法  |     说明                                                            | 默认值 |
|:------:|:-----------:|:-----:|
| onSelectAll |  全选  |   "cltr+A"   |
| onCopy |  复制 |   "cltr+C"   |
| onPaste |  粘贴  |   "cltr+V"   |
| onDelete |  删除  |   "cltr+D" 或者 "delete"  |
| onUndo |  撤退 |   "cltr+Z  |
| onRedo |  重做  |   "ctrl+shift+Z"  |
