'use strict';

const Group = require('../../../index.js').Group;
const $ = require('jquery');
const _ = require('lodash');

class Agroup extends Group {
    draw(obj) {
        let _dom = obj.dom;
        if (!_dom) {
            _dom = $('<div></div>')
                .attr('class', 'group')
                .css('top', obj.top)
                .css('left', obj.left)
                .css('width', obj.width)
                .attr('id', obj.id);
        }
        let group = $(_dom);

        this._createTitle(group, obj.options);
        this._createGroupContent(group, obj.options);
        this.editGroupTitle(group);
        this.editGroupContent(group);
        this.closeGroup();

        return _dom;
    }

    _createTitle(group, data) {
      let title = $(
        `<div class="title">
          <span id="close"><i class="iconfont">&#xe63a;</i></span>
          <span id="title-text">${data.title}</span>
          <span id="title-edit"><i class="iconfont">&#xe683;</i></span>
        </div>`);
      group.append(title)
    }

    _createGroupContent(group, data) {
      let con = $(`
      <div class="container" >
        <p>${data.text}</p>
        <span id="edit-container"><i class="iconfont">&#xe683;</i></span>
      </div>`);

      group.append(con);
    }

    closeGroup() {
      $(function () {
        $('.title > #close').on('click', function() {
          $(this).parents('.group').remove();
        })
      })
    }

    editGroupTitle(dom = this.dom) {
      $(dom).find('#title-edit').each(function () {
        $(this).on('click', function (e) {
          const oldNode = $(this).prev('#title-text').html();
          $(this).prev('#title-text').html(`<input type=text name=editname class=input-text value='${oldNode}' autofocus />`);
          $(this).prev('#title-text').children().keyup(function (event) {
            if (event.keyCode === 13 || event.keyCode === 27) {
              const oldInputText = $(this).val();
              $(this).parent('#title-text').text(oldInputText);
            }
          });
        });
      });
    }

    editGroupContent(dom = this.dom) {
      $(dom).find('#edit-container').each(function () {
        $(this).on('click', function (e) {
          const oldNode = $(this).prev('.container > p').html();
          $(this).prev('.container > p').html(`<textarea class=input-text-group>${oldNode}</textarea>`);
          $(this).prev('.container > p').children().keyup(function (event) {
            if (event.keyCode === 13 || event.keyCode === 27) {
              const oldInputText = $(this).val();
              $(this).parent('.container > p').text(oldInputText);
            }
          });
        });
      });
    }
};
module.exports = Agroup;