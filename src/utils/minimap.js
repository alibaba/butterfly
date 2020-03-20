const _ = require('lodash');
const $ = require('jquery');

// 每一个dot是一个圆形或者
const DOT_COLOR = 'rgba(76, 158, 164, 1)';
const GROUP_COLOR = 'rgba(61, 86, 92, 1)';
const DOT_ACTIVE_COLOR = 'rgba(255, 253, 76, 1)';
const GROUP_ACTIVE_COLOR = 'rgba(255, 253, 76, 1)';
const SAFE_DISTANCE = 20;

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
 *  zoom {Number} 画布当前缩放比
 *  move {Function} 缩略图互动函数, 用于移动画布, 参考小蝴蝶的move
 *  terminal2canvas {Function} 互动函数, 屏幕坐标到画布坐标的转换
 *  safeDistance {Number} 画布视口在minimap距离边距的安全距离，默认20
 *  activeNodeColor {String} 选中的节点颜色
 *  activeGroupColor {String} 选中的节点组颜色
 *  events {String[]} 补充的监听事件
 */
class Minimap {
  constructor(options) {
    checkOpts(options);

    this.root = options.root;
    this.$root = $(this.root);

    this.options = {
      height: 200,
      width: 200,
      className: 'butterfly-minimap-container',
      containerStyle: {},
      viewportStyle: {},
      backgroudStyle: {},
      nodeColor: DOT_COLOR,
      groupColor: GROUP_COLOR,
      activeNodeColor: DOT_ACTIVE_COLOR,
      activeGroupColor: GROUP_ACTIVE_COLOR,
      containerWidth: $(this.root).width(),
      containerHeight: $(this.root).height(),
      nodes: [],
      groups: [],
      offset: [0, 0],
      zoom: 1,
      move: () => null,
      terminal2canvas: () => null,
      safeDistance: SAFE_DISTANCE,
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


  // 获取所有元素的屏幕坐标
  getItemsPoint = () => {
    const nodes = _.cloneDeep(this.options.nodes);
    const groups = _.cloneDeep(this.options.groups);
    const {canvas2terminal} = this.options;
    const height = this.$root.height();
    const width = this.$root.width();

    // 增加两个虚拟的点，防止只有一个node时宽度过大的问题
    nodes.push({left: 0, top: 0, height: 1, width: 1});
    nodes.push({left: width, top: height, height: 1, width: 1});

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

    groups.forEach(group => {
      const leftTop = [group.left, group.top];
      const rightBottom = [group.left + group.width, group.top + group.height];

      const screenLeftTop = canvas2terminal(leftTop);
      const screenRightBottom =  canvas2terminal(rightBottom);

      group.screenLeftTop = screenLeftTop;
      group.screenRightBottom = screenRightBottom;

      group.left = screenLeftTop[0];
      group.top = screenLeftTop[1];
      group.width = screenRightBottom[0] - screenLeftTop[0];
      group.height = screenRightBottom[1] - screenLeftTop[1];
    });

    nodes.forEach(node => {
      const leftTop = [node.rleft, node.rtop];
      const rightBottom = [node.rleft + node.width, node.rtop + node.height];

      const screenLeftTop = canvas2terminal(leftTop);
      const screenRightBottom =  canvas2terminal(rightBottom);

      node.left = screenLeftTop[0];
      node.top = screenLeftTop[1];
      node.width = screenRightBottom[0] - screenLeftTop[0];
      node.height = screenRightBottom[1] - screenLeftTop[1];
    });

    return {
      groups, nodes
    }
  }

  // 获取画布的有内容的区域
  getBBox() {
    const {nodes, groups} = this.getItemsPoint()

    const check = (v) => {
      return _.isNumber(v) ? v : 0;
    }

    const allNTop = nodes.map(node => node.top);
    const allNLeft = nodes.map(node => node.left);
    const allNBottom = nodes.map(node => node.top + node.height);
    const allNRight = nodes.map(node => node.left + node.width);

    const allGTop = groups.map(group => group.top);
    const allGLeft = groups.map(group => group.left);
    const allGBottom = groups.map(group => group.top + group.height);
    const allGRight = groups.map(group => group.left + group.width);

    const allTop = allNTop.concat(allGTop);
    const allLeft = allNLeft.concat(allGLeft);

    const allBottom = allNBottom.concat(allGBottom);
    const allRight = allNRight.concat(allGRight);

    const minX = check(_.min(allLeft));
    const minY = check(_.min(allTop));

    const maxX = check(_.max(allRight));
    const maxY = check(_.max(allBottom));

    return {
      minX: minX,
      minY: minY,
      width: maxX - minX,
      height: maxY - minY,
    }
  }

  // 获取画布和缩略图的缩放比
  setRatio() {
    const height = this.options.height;
    const width = this.options.width;
    const graphSize = this.getBBox();

    if(graphSize.width === 0 || graphSize.height === 0) {
      return 0;
    }

    const ratio = Math.min(width / graphSize.width, height / graphSize.height);

    this.ratio = Number(ratio.toFixed(2));
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

  getViewportBBox = () => {
    const $viewport = $(this.viewportDOM);
    const parent = $viewport.offsetParent();
    const offset = $viewport.offset();
    const poffset = $(parent).offset();
    const left = offset.left - poffset.left;
    const top = offset.top - poffset.top;

    const width = $viewport.width();
    const height = $viewport.height();
    const right = left + width;
    const bottom = top + height;

    return {
      left, top, right,bottom, height, width
    }
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
      height:  height + 'px',
      width: width + 'px',
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
      ...viewportStyle,
    });

    modifyCSS(this.backgroundDOM , {      
      ...initStyle,
      ...backgroudStyle,
      height: height + 'px',
      width: width + 'px',      
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
        e.preventDefault();
        e.stopPropagation();
        const viewportDOM = this.viewportDOM;

        if (e.target !== this.viewportDOM) {
          return;
        }

        const viewportBBox = this.getViewportBBox();

        left = parseInt(viewportBBox.left, 10);
        top = parseInt(viewportBBox.top, 10);

        dragging = true;
        x = e.clientX;
        y = e.clientY;
      },
      mousemove: (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!dragging || _.isNil(e.clientX) || _.isNil(e.clientY)) {
          return;
        }

        let dx = x - e.clientX;
        let dy = y - e.clientY;

        left -= dx;
        top -= dy;

        const {width: mapWidth, height: mapHeight, safeDistance} = this.options;
        const {width: vpWidth, height: vpHeight} = this.getViewportBBox();

        // 限制视口不能够超出 minimap 的安全距离
        if(
          left >= mapWidth - safeDistance ||
          top >= mapHeight - safeDistance ||
          left + vpWidth <= safeDistance ||
          top + vpHeight <= safeDistance
        ) {
          left += dx;
          top += dy;

          return;
        }


        modifyCSS(this.viewportDOM, {
          left: left + 'px',
          top: top + 'px'
        });

        const {minX, minY} = this.getBBox();
        const offset = this.$root.offset();
        const boffset = this.options.offset;

        const ddx = (((-left / this.ratio) + offset.left) - minX) * this.ratio;
        const ddy = (((-top / this.ratio) + offset.top) - minY) * this.ratio;
        
        this.options.move(
          [
            boffset[0] + ddx / this.ratio,
            boffset[1] + ddy / this.ratio
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
    const {width, height, nodeColor, groupColor, activeNodeColor, activeGroupColor} = this.options;
    const cvsRatio = this.cvsRatio;

    cvsCtx.clearRect(0, 0, width, height);

    // 根据所有点的信息画出所有的点
    const {nodes, groups} = this.getItemsPoint();
    const {minX, minY} = this.getBBox();

    groups.forEach(group => {
      const left = (group.left - minX) * this.ratio;
      const top = (group.top - minY) * this.ratio;
      const width = group.width * this.ratio;
      const height = group.height * this.ratio;
      const minimapActive = group.minimapActive;

      if(minimapActive) {
        cvsCtx.fillStyle = activeGroupColor;
      } else {
        cvsCtx.fillStyle = groupColor;
      }

      cvsCtx.fillRect(left / cvsRatio, top / cvsRatio, width / cvsRatio, height / cvsRatio);
    });

    nodes.forEach(node => {
      const left = (node.left - minX) * this.ratio;
      const top = (node.top - minY) * this.ratio;
      const width = node.width * this.ratio;
      const height = node.height * this.ratio;

      if(node.minimapActive) {
        cvsCtx.fillStyle = activeNodeColor;
      } else {
        cvsCtx.fillStyle = nodeColor;
      }

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

    const {minX, minY} = this.getBBox();

    const {top, left} = this.$root.offset();

    const rootWidth = this.$root.width();
    const rootHeight = this.$root.height();
    const offset = [left - minX, top - minY];

    // 获取画布到minimap的缩放比
    const ratio = this.ratio;

    const vwidth = rootWidth * this.ratio;
    const vheight = rootHeight * this.ratio;
    const vleft = Math.round(Math.round(offset[0]) * ratio);
    const vtop = Math.round(Math.round(offset[1]) * ratio);

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

export default Minimap;
