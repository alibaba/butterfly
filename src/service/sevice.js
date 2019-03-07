const $ = require('jquery');
const _ = require('lodash');

class MenuService {
  constructor(){}
  /** 
   * 创建提示框
  */
  creatTips(param){
      /**
       *  param是个对象: {title: '必须有', contente: '必须有', pos: {left: '', top: ''}} 
       */
    $('.butterfly-tips-menu').remove();
      let _content = $('<div class="tips-menu-content"><div class="content-box"><span class="yellow-point"></span><span class="text">' + param.content + '</span></div></div>');
      let _dom =  $('<div class="butterfly-tips-menu"></div>').css('top', _.get(param, 'pos.top', 0) + 5).css('left', _.get(param, 'pos.left', 0) - 100);
      let _title = $('<div class="tips-menu-title"></div>')
                    .text(param.title);
                    _title.appendTo(_dom);
                    _content.appendTo(_dom);
                    _dom.appendTo($(document.body));
  }
  /** 
   * 创建菜单浮层
  */
  createMenu(param, callBack) {
    /** 
     * 其他： param是个特定字段的对象，例如{list: [{code: '', title: ''}], pos: {left: '', top: ''}}
    */
    $('.butterfly-node-menu').remove();
      let nodeMenu = $('<ul class="butterfly-node-menu"></ul>').css('top', _.get(param, 'pos.top', 0)).css('left', _.get(param, 'pos.left', 0));
      _.get(param, 'list', []).forEach((item, index) => {
      $('<li class="node-menu-item"></li>')
            .attr('key', `${item.code}_${index}`)
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
  /** 
   * 隐藏tips
  */

  hideTips(type) {
    $('.butterfly-tips-menu').remove();
  }
  /** 
   * 隐藏菜单
   */
  hideMenu(){
    $('.butterfly-node-menu').remove();
  }       
}

module.exports = MenuService;
