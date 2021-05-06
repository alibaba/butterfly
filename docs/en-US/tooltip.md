## Tooltips & Menu

## Tips Usage
```js
import {Tips} from 'butterfly-dag';
let container = document.getElementById('.you-target-dom');
Tips.createTip({
  className: `butterfly-custom-tips`,
  targetDom: container,
  genTipDom: () => { return $('<div>content</div>')[0] },
  placement: 'right'
});
```

## Menu Usage
```js
import {Tips} from 'butterfly-dag';
let container = document.getElementById('.you-target-dom');
Tips.createMenu({
  className: `butterfly-custom-menu`,
  targetDom: container,
  genTipDom: () => { return $('<div>content</div>')[0] },
  placement: 'right',
  action: 'click',
  closable: true
});
```

## API

| attr | desc | type | require | default |
| ------------------------ | ---------------------------------------------- | -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| className | class name | string   | no | empty
| placement | show direction | string | no | right
| x | x coordinate | string | no | empty
| y | y coordinate  | string | no | empty
| closable | click other blank space to close | string | no | empty |
| targetDom | the dom of tips or menu appears | HTML DOM | yes | empty |
| genTipDom | this method returns a DOM to display the contents of the tips or menu | function | yes | empty |
