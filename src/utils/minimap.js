const _ = require('lodash');
const $ = require('jquery');


// 每一个dot是一个圆形或者
const DOT_COLOR = 'rgba(76, 158, 164, 1)';
const GROUP_COLOR = 'rgba(61, 86, 92, 1)';

// 修改一个element的css的属性
const modifyCSS = (ele, cssStyle) => {
  if (!ele || !ele.style) {
    return;
  }

  Object.keys(cssStyle).forEach(key => {
    ele.style[key] = cssStyle[key];
  });
};

// 获取Canvas缩放比，兼容高清屏
const getPixelRatio = function (context) {
  const backingStore = context.backingStorePixelRatio ||
  context.webkitBackingStorePixelRatio ||
  context.mozBackingStorePixelRatio ||
  context.msBackingStorePixelRatio ||
  context.oBackingStorePixelRatio ||
  context.backingStorePixelRatio || 1;
  return (window.devicePixelRatio || 1) / backingStore;
};

// check constructor 的 options
const checkOpts = (options) => {
  if(!options) {
    throw new Error('options cant be empty');
  }

  if(!options.root || typeof options.root !== 'object' || !$(options.root)) {
    throw new Error('options.root must be a html element');
  }

  if(!options.move || typeof options.move !== 'function') {
    throw new Error('options.move must be a fuction');
  }

  if(!options.terminal2canvas || typeof options.terminal2canvas !== 'function') {
    throw new Error('options.move must be a fuction');
  }

}

/**
 * options:
 *  height {Number} 缩略图高度 default 200,
 *  width  {Number} 缩略图宽度 default 200,
 *  className {String} default: butterfly-minimap-container
 *  containerStyle {Object} 外层css
 *  viewportStyle {Object} 视口css
 *  backgroudStyle {Object} 底层css
 *  nodeColor {String} 节点颜色
 *  groupColor {String} 节点组颜色
 *  root {Element} 画布容器节点
 *  containerWidth {Number} 画布的宽度, 可自定义
 *  containerHeight {Number} 同上
 *  nodes {Pointer[]} 节点信息
 *    node.left, node.top 节点的坐标轴信息
 *  groups {Object[]} 节点组信息
 *    group.left, group.top, group.width, group.height 节点组的二维信息
 *  offset {Pointer} 偏移信息
 *  zoom {Nuber} 画布当前缩放比
 *  move {Function} 缩略图互动函数, 用于移动画布, 参考小蝴蝶的move
 *  terminal2canvas {Function} 互动函数, 屏幕坐标到画布坐标的转换
 */
class Minimap {
  constructor(options) {
    checkOpts(options);

    this.root = options.root;
    this.options = {
      height: 200,
      width: 200,
      className: 'butterfly-minimap-container',
      containerStyle: {},
      viewportStyle: {},
      backgroudStyle: {},
      nodeColor: DOT_COLOR,
      groupColor: GROUP_COLOR,
      containerWidth: $(this.root).width(),
      containerHeight: $(this.root).height(),
      nodes: [],
      groups: [],
      offset: [0, 0],
      zoom: 1,
      move: () => null,
      terminal2canvas: () => null,
      ...options
    };

    // 画布到缩略图的缩放比
    this.ratio = 1;    

    // 初始化容器
    this.initContainer();
    // 渲染视口
    this.renderViewPort();
    // 渲染背景
    this.renderBG();
  }

  // 获取画布的有内容的区域
  getBBox() {
    const {nodes, groups} = this.options;
    const check = (v) => {
      return _.isNumber(v) ? v : 0;
    }

    const allNTop = nodes.map(node => node.top);
    const allNLeft = nodes.map(node => node.left);

    const allGBottom = groups.map(group => group.top + group.height);
    const allGRight = groups.map(group => group.right + group.width);

    const allTop = allNTop.concat(allGBottom);
    const allLeft = allNLeft.concat(allGRight);

    const minX = check(_.min(allLeft));
    const maxX = check(_.max(allLeft));
    const minY = check(_.min(allTop));
    const maxY = check(_.max(allTop));

    return {
      minX: minX,
      minY: minX,
      width: maxX - minX,
      height: maxY - minY,
    }
  }

  // 画布size
  getCanvasSize = () => {
    return {
      width: this.options.containerWidth,
      height: this.options.containerHeight
    }
  }

  // 可视区域size
  getGraphSize() {
    // 不写0防止除0错误
    let width = 1;
    let height = 1;
    let minX = 0;
    let minY = 0;

    const bbox = this.getBBox();
    const gSize = this.getCanvasSize();

    try {
      width = _.max([
        gSize.width, bbox.width
      ]);

      height = _.max([
        gSize.height, bbox.height
      ]);

      minX = _.min([bbox.minX, 0]);
      minY = _.min([bbox.minY, 0]);
    } catch (e) {
      console.log(e); // eslint-disable-line
    }

    return {
      width, height, minX, minY
    };
  }

  // 获取画布和缩略图的缩放比
  setRatio() {
    if (this.ratio !== 1) {
      return;
    }

    const height = this.options.height;
    const width = this.options.width;
    const graphSize = this.getGraphSize();
    const ratio = Math.min(width / graphSize.width, height / graphSize.height);

    this.ratio = ratio;    
  }

  // 更新小地图数据
  update({
    nodes = [],
    groups = [],
    zoom = 1,
    offset = [0, 0],
  }) {
    this.options.nodes = nodes;
    this.options.groups = groups;
    this.options.zoom = zoom;
    this.options.offset = offset;

    this.debounceRender();
  }

  // 初始化画布
  initContainer() {
    const {
      height, width, className, 
      viewportStyle, backgroudStyle, containerStyle
    } = this.options;

    this.container = document.createElement('div');
    this.viewportDOM = document.createElement('div');
    this.backgroundDOM = document.createElement('div');

    this.container.setAttribute('class', className);

    const initStyle = {
      position: 'absolute',
      left: 0,
      top: 0,
      overflow: 'hidden',
      height: height + 'px',
      width: width + 'px'
    };

    modifyCSS(this.container, {
      ...initStyle,
      right: '10px',
      bottom: '10px',
      left: 'none',
      top: 'none',
      height: height + 2 + 'px',
      width: width + 2 + 'px',
      border: '1px solid #aaa',
      'z-index': 100,
      ...containerStyle
    });

    modifyCSS(this.viewportDOM , {
      ...initStyle,
      left: 0,
      top: 0,
      // border: '1px solid pink',
      'background-color': 'rgba(79, 111, 126, 0.4)',
      viewportStyle,
    });

    modifyCSS(this.backgroundDOM , {
      ...initStyle,
      ...backgroudStyle
    });

    this.root.appendChild(this.container);
    this.container.appendChild(this.backgroundDOM);
    this.container.appendChild(this.viewportDOM);

    this.initBGCanvas();
    this.initViewportEvts();
  }

  // 创建BG canvas
  initBGCanvas() {
    const {width, height} = this.options;
    const canvasDom = document.createElement('canvas');
    this.backgroundDOM.appendChild(canvasDom);

    canvasDom.setAttribute('width', width);
    canvasDom.setAttribute('height', height);
    modifyCSS(canvasDom, {
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0
    });

    const cvsCtx = canvasDom.getContext('2d');
    // 初始化2D画布
    this.cvsCtx = cvsCtx;
    this.cvsRatio = getPixelRatio(cvsCtx);
    cvsCtx.scale(this.cvsRatio, this.cvsRatio);
  }

  // 初始化视窗事件
  initViewportEvts() {
    let dragging = false;
    let x = 0;
    let y = 0;
    let left = 0;
    let top = 0;

    this.viewportEvents = {
      mousedown: (e) => {
        const viewportDOM = this.viewportDOM;

        if (e.target !== this.viewportDOM) {
          return;
        }

        const style = viewportDOM.style;

        left = parseInt(style.left, 10);
        top = parseInt(style.top, 10);
        dragging = true;
        x = e.clientX;
        y = e.clientY;
      },
      mousemove: (e) => {
        if (!dragging || _.isNil(e.clientX) || _.isNil(e.clientY)) {
          return;
        }

        let dx = x - e.clientX;
        let dy = y - e.clientY;

        if (left - dx < 0) {
          dx = left;
        }

        if (top - dy < 0) {
          dy = top;
        }

        left -= dx;
        top -= dy;

        modifyCSS(this.viewportDOM, {
          left: left + 'px',
          top: top + 'px'
        });

        const zoom = this.options.zoom;

        this.options.move(
          [
            (-left / this.ratio) * zoom,
            (-top / this.ratio) * zoom
          ]
        );

        x = e.clientX;
        y = e.clientY;
      },
      mouseleave: () => {
        dragging = false;
      },
      mouseup: () => {
        dragging = false;
      }
    };

    Object.keys(this.viewportEvents).forEach(key => {
      this.container.addEventListener(key, this.viewportEvents[key]);
    });
  }

  // 渲染缩略图canvas
  renderBG() {
    const cvsCtx = this.cvsCtx;
    const {width, height, nodeColor, groupColor} = this.options;
    const cvsRatio = this.cvsRatio;

    cvsCtx.clearRect(0, 0, width, height);

    // 根据所有点的信息画出所有的点
    const nodes = this.options.nodes;
    const groups = this.options.groups;

    // 计算所有 nodes 的真实坐标
    for(let node of nodes) {
      if(node.group) {
        const group = _.find(groups, {id: node.group});

        if(!group) {
          continue;
        }

        node.rleft = group.left + node.left;
        node.rtop = group.top + node.top;

        continue;
      }

      node.rleft = node.left;
      node.rtop = node.top;
    }


    cvsCtx.fillStyle = groupColor;
    groups.forEach(group => {
      const left = group.left * this.ratio ;
      const top = group.top * this.ratio;
      const width = group.width * this.ratio;
      const height = group.height * this.ratio;

      cvsCtx.fillRect(left / cvsRatio, top / cvsRatio, width / cvsRatio, height / cvsRatio);
    });

    cvsCtx.fillStyle = nodeColor;

    nodes.forEach(node => {
      const left = node.rleft * this.ratio;
      const top = node.rtop * this.ratio;
      const width = node.width * this.ratio;
      const height = node.height * this.ratio;

      // cvsCtx.beginPath();
      cvsCtx.fillRect(left / cvsRatio, top / cvsRatio, width / cvsRatio, height / cvsRatio);
      // cvsCtx.arc(left / cvsRatio, top / cvsRatio, DOT_SIZE / cvsRatio, 0, 2*Math.PI);
      // cvsCtx.closePath();
      // cvsCtx.fill();
    });    

  }

  // 绘制出拖动框
  renderViewPort() {
    this.setRatio();
    const {width, height} = this.options;
    const graphSize = this.getGraphSize();
    const topLeft = this.options.terminal2canvas([0, 0]);
    const bottomRight = this.options.terminal2canvas([graphSize.width, graphSize.height]);

    const offset = this.options.offset;
    const zoom = this.options.zoom;

    // 获取画布到minimap的缩放比
    const ratio = this.ratio;

    const vwidth = _.min([(bottomRight[0] - topLeft[0]) * ratio, width]);
    const vheight = _.min([(bottomRight[1] - topLeft[1]) * ratio, height]);
    const vleft = -((offset[0] / zoom) * ratio);
    const vtop = -((offset[1] / zoom) * ratio);

    modifyCSS(this.viewportDOM, {
      width: `${vwidth}px`,
      height: `${vheight}px`,
      left: `${vleft}px`,
      top: `${vtop}px`,
    });
  }

  // 延时渲染
  debounceRender = _.debounce(() => {
    this.renderViewPort();
    this.renderBG();
  }, 100)

  destroy() {
    // 销毁DOM
    this.root.removeChild(this.container);
  }
}

module.exports = Minimap;
