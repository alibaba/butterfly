简单的文字提示气泡框。

## 何时使用

鼠标移入则显示提示，移出消失，气泡浮层不承载复杂文本和操作。

可用来代替系统默认的 `title` 提示，提供一个`文字`的文案解释。

- let newDom = tip.creatTips(option, dom, callBack)

## API

| 参数                     | 说明                                           | 类型     | 默认值                                                                                                                                                   |
| ------------------------ | ---------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dom                      | 需要提示框的 dom                               | Element  | 无                                                                                                                                                       |
| callBack                 | 回调函数 callBack(value,e) value 是内内容值    | function | 无                                                                                                                                                       |
| option.placement         | 气泡框位置，可选 `top` `left` `right` `bottom` | string   | top                                                                                                                                                      |
| option.content           | 提示文字                                       | string   |                                                                                                                                                          | Element | 无 |
| option.TEMPLATE          | 模板 html                                      | Element  | `'<div class="butterfly-toolTip" role="butterfly-tooltip"><div class="butterfly-tooltip-arrow"></div><div class="butterfly-tooltip-inner"></div></div>'` |
| option.\$viewAppend      | 模板挂载节点                                   | string   | '.butterfly-wrapper'                                                                                                                                     |
| option.callbackWhitelist | 事件白名单标签                                 | []       | ['LI']                                                                                                                                                   |
| option.evntList          | 支持的事件，目前支持 'hover', 'click'          | []       | ['hover']                                                                                                                                                |
| option.callBackOpen      | 是否开启回调事件                               | Boolean  | true                                                                                                                                                     |

提供一个`操作`的气泡。

- let newDom = tip.creatMenus(option, dom, callBack,menu,showTip)
- option. 参数大部分同上
- 示例 menu = [
  {key: 1, value: '新增'},
  {key: 2, value: '删除'},
  ],
- content 会重新生成
  | 参数 | 说明 | 类型 | 默认值 |
  | ------------------------ | ---------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | option.evntList | 支持的事件，目前支持 'hover', 'click' | [] | ['click']
  | option.placement | 气泡框位置，可选 `top` `left` `right` `bottom` | string | right
  | dom | 需要提示框的 dom | Element | 无 |
  | callBack | 回调函数 callBack(value,e) value 是内内容值 | function | 无
  | menu | 菜单 | [] | []
  | showTip | 是否在菜单内展示 tip 内容 | Boolean | false
