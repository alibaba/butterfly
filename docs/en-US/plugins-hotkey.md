# Introduction：
- A hotket plugin for butterfly;
- We support the built-in functions of these shown in default function table
- Hotkey configuration supported.


# 使用方式
- Capital letters are allowed only in configuration
- Camel-Case allowed only for functional key
- eg： A instead of a；cltr instead of Ctrl ；rightArrow instead of other;


```js
import * as HotKeyPlugin from 'butterfly-dag/plugins/hotkey/dist/index.unpkg.js';';

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
| canvas | canva |            object          |   {}   |
| root | dom |        Dom      |   {}   |
| config | see example |        Array      |   []   |


## Default Functions
|  方法  |     说明                                                            | 默认值 |
|:------:|:-----------:|:-----:|
| onSelectAll |  select all  |   "cltr+A"   |
| onCopy |  copy |   "cltr+C"   |
| onPaste |  paste  |   "cltr+V"   |
| onDelete |  delete  |   "cltr+D" 或者 "delete"  |
| onUndo |  undo |   "cltr+Z  |
| onRedo |  redo  |   "ctrl+shift+Z"  |
