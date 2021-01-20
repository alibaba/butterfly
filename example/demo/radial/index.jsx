'use strict';
import React, {Component} from 'react';

const Canvas = require('../../../index.js').Canvas;
const {data} = require('./data');
require('./index.less');
require('butterfly-dag/dist/index.css');

class Radial extends Component {
    constructor() {
        super();
      }
      componentDidMount() {
        let root = document.getElementById('dag-canvas');
        this.canvas = new Canvas({
            root: root,
            disLinkable: true, // 可删除连线
            linkable: false,    // 可连线
            draggable: true,   // 可拖动
            zoomable: true,    // 可放大
            moveable: true,    // 可平移
            layout: {
              type: 'radial',
              options: {
                  // 布局画布总宽度
                  width: 500,
                  // 布局画布总长度
                  height: 500,
                  /** 停止迭代的最大迭代数 */
                  maxIteration: 1000,
                  /** 布局中心 */
                  center: [250, 250],
                  /** 中心点，默认为数据中第一个点 */
                  focusNode: null,
                  /** 每一圈半径 */
                  unitRadius: null,
                  /** 默认边长度 */
                  linkDistance: 50,
                  /** 是否防止重叠 */
                  preventOverlap: false,
                  /** 节点直径 */
                  nodeSize: undefined,
                  /** 节点间距，防止节点重叠时节点之间的最小距离（两节点边缘最短距离） */
                  nodeSpacing: undefined,
                  /** 是否必须是严格的 radial 布局，即每一层的节点严格布局在一个环上。preventOverlap 为 true 时生效 */
                  strictRadial: true,
                  /** 防止重叠步骤的最大迭代次数 */
                  maxPreventOverlapIteration: 200,
                  link: {
                      // 线条的距离
                      distance: 50,
                      // 线条的粗细
                      strength: 1
                  },
              },
            },
            theme: {
              edge: {
                type: 'Straight',
                arrow: true,
                arrowPosition: 0.8,
              }
            }
          });
        this.canvas.draw(data);
        this.canvas.on('events', (data) => {
          console.log(data);
        });
      }
      render() {
        return (
          <div className='radial-page'>
            <div className="radial-canvas" id="dag-canvas">
            </div>
          </div>
        );
      }
}

module.exports = Radial;
