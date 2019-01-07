'use strict';

const $ = require('jquery');

class SelectCanvas {
  constructor() {
    this.dom = $('<canvas class="butterfly-canvas-warpper"></canvas>')[0];
    this.cxt = this.dom.getContext('2d');
    this.canvasTop = 0;
    this.canvasLeft = 0;
    this.canvasHeight = 0;
    this.canvasWidth = 0;
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
    this._on = null;
    this._emit = null;
    this.isDraw = false;
  }
  init(opts) {
    let root = opts.root;
    let offset = $(root).offset();
    this.canvasTop = offset.top;
    this.canvasLeft = offset.left;
    this.canvasHeight = $(root).height();
    this.canvasWidth = $(root).width();
    this._on = opts._on;
    this._emit = opts._emit;
    $(this.dom).attr('width', this.canvasWidth);
    $(this.dom).attr('height', this.canvasHeight);
    this.addEventLinster();
    $(this.dom).appendTo(root);
  }
  addEventLinster() {
    this.dom.addEventListener('mousedown', this.mouseDown.bind(this));
    this.dom.addEventListener('mouseup', this.mouseUp.bind(this));
    this.dom.addEventListener('mousemove', this.mouseMove.bind(this));
    this.dom.addEventListener('mouseleave', this.mouseLeave.bind(this));
  }
  mouseDown(evt) {
    this.startX = evt.clientX;
    this.startY = evt.clientY;
    this.isDraw = true;
  }
  mouseUp(evt) {
    this.isDraw = false;
    this.clearCanvas();
    let startX = this.startX;
    let startY = this.startY;
    let endX = this.endX;
    let endY = this.endY;

    let startLeft = startX > endX ? endX : startX;
    let startTop = startY > endY ? endY : startY;
    let endLeft = startX > endX ? startX : endX;
    let endTop = startY > endY ? startY : endY;


    this._emit('InnerEvents', {
      type: 'multiple:select',
      range: [startLeft, startTop, endLeft, endTop]
    });
  }
  mouseMove(evt) {
    if (!this.isDraw) {
      return;
    }

    this.endX = evt.clientX;
    this.endY = evt.clientY;
    this.drawRect();
  }
  mouseLeave(evt) {
    this.isDraw = false;
    this.clearCanvas();
  }
  drawRect() {
    if (!this.isDraw) {
      return;
    }
    this.clearCanvas();
    let startX = Math.min(this.startX, this.endX) - this.canvasLeft;
    let startY = Math.min(this.startY, this.endY) - this.canvasTop;
    let width = Math.abs(this.startX - this.endX);
    let height = Math.abs(this.startY - this.endY);

    this.cxt.beginPath();
    this.cxt.rect(startX, startY, width, height);
    this.cxt.fillStyle = '#b3dbff';
    this.cxt.fill();
    this.cxt.lineWidth = '1';
    this.cxt.strokeStyle = '#3da4ff';
    this.cxt.stroke();
  }
  clearCanvas() {
    this.cxt.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }
  getCanvas() {
    return this.dom;
  }
  active() {
    $(this.dom).addClass('warpper-up');
  }
  unActive() {
    $(this.dom).removeClass('warpper-up');
  }
}

module.exports = SelectCanvas;
