const $ = require('jquery');
const _ = require('lodash');


function createMenuList(param, callBack, e) {
/** 
 * param.type:
 * 若tips： param是个对象: {type: 'tips', title: '必须有', contente: '必须有'} 
 * 其他： param是： {list: [{code: '', title: ''}]}  里面的字段必须传的
 * 
*/
let evt = e || window.event;
let pos = {
    left: evt.clientX,
    top: evt.clientY
};
if (param.type === 'tips') {
    $(document.body).find('.endpoint-tips-menu').remove();
    let _content = $('<div class="endpoint-tips-menu-content"><div class="content-box"><span class="yellow-point"></span><span class="text">' + param.content + '</span></div></div>');
    let _dom =  $('<div class="endpoint-tips-menu"></div>').css('top', pos.top + 5).css('left', pos.left - 100);
    let _title = $('<div class="endpoint-tips-menu-title"></div>')
    .text(param.title);
    _title.appendTo(_dom);
    _content.appendTo(_dom);
    _dom.appendTo($(document.body));
} else {
    $(document.body).find('.node-menu').remove();
    let nodeMenu = $('<ul class="node-menu"></ul>').css('top', pos.top).css('left', pos.left);
    _.get(param, 'list', []).forEach((item) => {
    $('<li class="node-menu-item"></li>')
        .attr('key', item.code)
        .text(item.title)
        .on('click', (e) => {
        e.stopPropagation();
        if (typeof callBack === 'function') {
            return callBack(item);
        }
        })
        .appendTo(nodeMenu);
    });
    nodeMenu.appendTo($(document.body));
}
}
function hideMenuList(type) {
    if (type === 'tips') {
        $(document.body).find('.endpoint-tips-menu').remove();
    } else {
        $(document.body).find('.node-menu').remove();
    }
}

module.exports = {
    createMenuList,
    hideMenuList
};