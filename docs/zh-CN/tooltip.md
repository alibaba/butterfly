# 提示 & 菜单(tooltips & menu)

## 提示用法
```js
import {Tips} from 'butterfly-dag';
let container = document.getElementById('.you-target-dom');
Tips.createTip({
  className: `butterfly-custom-tips`,
  targetDom: container,
  genTipDom: () => { return $('<div>内容</div>')[0] },
  placement: 'right'
});
```

## 菜单用法
```js
import {Tips} from 'butterfly-dag';
let container = document.getElementById('.you-target-dom');
Tips.createMenu({
  className: `butterfly-custom-menu`,
  targetDom: container,
  genTipDom: () => { return $('<div>内容</div>')[0] },
  placement: 'right',
  action: 'click',
  closable: true
});
```

## API

| 参数 | 说明 | 类型 | 必选 | 默认值 |
| ------------------------ | ---------------------------------------------- | -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| className | 类名 | string   | 否 | 无
| placement | 出现方向 | string | 否 | right
| x | x坐标  | string | 否 | 无
| y | y坐标  | string | 否 | 无
| closable | 点击其他空白处是否关闭 | string | 否 | 无 |
| targetDom | 出现tips或者menu的dom | HTML DOM | 是 | 无 |
| genTipDom | 此方法返回一个dom，为提示或菜单的内容展示 | funtion | 是 | 无 |
