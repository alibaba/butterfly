# Introduction：
- A hotkey plugin for butterfly;
- We support the built-in functions of these shown in default functions table
- Hotkey configuration supported.


# Usage
- Capital letters are allowed only in configuration
- Camel-Case allowed only for functional key
> eg： A instead of a；cltr instead of Ctrl ；rightArrow instead of others;


#### Register
```JavaScript
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

|  Params  |     Instruction    |                                    Type                                    | Default |
|:------:|:-----------:|:---------------------------------------------------------------------------:|:-----:|
| canvas | canva instance|            object          |   {}   |
| root | dom |        Dom      |   {}   |
| config | see example |        Array      |   []   |


## Default Functions
|  Method  |     Instruction                                                            | Default |
|:------:|:-----------:|:-----:|
| onSelectAll |  select all  |   "cltr+A"   |
| onCopy |  copy |   "cltr+C"   |
| onPaste |  paste  |   "cltr+V"   |
| onDelete |  delete  |   "cltr+D" or "delete"  |
| onUndo |  undo |   "cltr+Z  |
| onRedo |  redo  |   "ctrl+shift+Z"  |
