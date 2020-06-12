简单的文字提示气泡框。

## 何时使用

鼠标移入则显示提示，移出消失，气泡浮层不承载复杂文本和操作。

可用来代替系统默认的 `title` 提示，提供一个`文字`的文案解释。

```
  // 开始使用


  opts.content = `<div>${opts.id}</div>`;

  // 配置x,y后不会自动计算位置
  opts.x = 200; 
  opts.y = 500;

  // 回调函数
  const callBack = (d, e) => {
    console.log(['回调', d, e]);
  };

  tip.creatTips(opts, dom); // 使用气泡

  tip.creatMenus( // 使用菜单
    opts,
    dom,
    callBack,
    [
      { key: 1, value: '新增' },
      { key: 2, value: '删除' },
    ],
  );
```

## API

  | 参数 | 说明 | 类型 | 默认值 |
  | ------------------------ | ---------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | opts.x | 偏移top量| number    | 无
  | opts.y | 偏移letf量 | number   | 无
  | option.content      | 提示文字   | string/Element | 无 |
  | option.placement | 气泡框位置，可选 `top` `left` `right` `bottom`(若配置opts.x,opts.y则失效) | string | right
  | dom | 需要提示框的 dom | jq对象 | 无 |
                                                                                                                   

提供一个`操作`的气泡。

- let newDom = tip.creatMenus(option, dom, callBack,menu)
- 示例 menu = [
  {key: 1, value: '新增'},
  {key: 2, value: '删除'},
  ],
- content 会重新生成
  | 参数 | 说明 | 类型 | 默认值 |
  | ------------------------ | ---------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | option.evntList | 支持的事件，目前支持 'hover', 'click' | [] | ['click']
  | opts.x | 偏移letf量 | 无
  | opts.y |  偏移top量 | 无
  | option.placement | 气泡框位置，可选 `top` `left` `right` `bottom`(若配置x,y则自动定位失效) | string | right
  | option.evntList | 支持的事件，目前支持 'mousedown', 'click' | [] | []
  | option.nowShow | 调用后立刻出现气泡 | true | boolean
  | dom | 需要提示框的 dom | jq对象 | 无 |
  | callBack | 回调函数 callBack(value,e) value 是内内容值 | function | 无
  | menu | 菜单 | [{ key: '', value: '' }] | []
  
