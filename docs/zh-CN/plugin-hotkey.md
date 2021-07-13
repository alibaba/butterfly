# Introduction：
小蝴蝶的快捷键插件；现目前内置了全选，删除，节点的复制和粘贴,redo，undo等功能；
也可以实现自定义的快捷键；

# 使用方式

> 自定义的快捷键key参数现在只支持大写字母输入 例如请输入A不要输入a

```js
import {HotKeyPlugin} from 'butterfly-dag/hotkey/plugins';

let canvasInstance = new Canvas({...});

HotKeyPlugin.register({
  canvas: this.canvasInstance,
  root:document.getElementById("dnd")
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

# api
## Hotkey:

|  参数  |     说明    |                                     类型                                    | 默认值 |
|:------:|:-----------:|:---------------------------------------------------------------------------:|:-----:|
| canvas | 画布 |            object          |   {}   |
| root | 事件绑定的dom元素 |        Dom      |   {}   |
| config | 配置 见Config props |        Array      |   []   |


## 常见的方式和默认的功能
|  参数  |     说明    |                                     类型                                    | 默认值 |
|:------:|:-----------:|:---------------------------------------------------------------------------:|:-----:|
| SelectAll |  全选 | Array<key> |   "cltr+A"   |
| onCopy |  复制 | Array<key> |   "cltr+C"   |
| onPaste |  粘贴 | Array<key> |   "cltr+V"   |
| onDelete |  删除 | Array<key> |   "cltr+D (delete)"  |
| onUndo |  撤退 | Array<key> |   "cltr+Z  |
| onRedo |  重做 | Array<key> |   "ctrl+shift+Z"  |
