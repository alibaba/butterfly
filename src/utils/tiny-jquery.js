/**
 * tiny jquery, replace full function jquery
 */

// 用于停放临时dom的创建
let tmpDom = document.createElement('div')

// default easing func: easy in and out
function swing(t) {
  return 0.5 - 0.5 * Math.cos(t * Math.PI);
}
/**
 * 
 * @param {*} dom
 *      dom可以是个 html string
 *      也可以是个选择器
 *      还可以是个dom节点
 * @returns 
 */
function $(dom) {
  if (typeof dom == 'string') {
    if (dom[0] == '<') {
      // create dom node
      tmpDom.innerHTML = dom;
      dom = tmpDom.childNodes[0];
    } else {
      dom = document.querySelectorAll(dom)
    }
  }
  if (dom instanceof DomNode) {
    return dom;
  }
  let node = {
    domNode: dom,
    get(index){
      if (Array.isArray(this.domNode)) {
        return this.domNode[index];
      }
      if (index === 0) {
        return this.domNode
      }
    },
    get length(){
      if (Array.isArray(this.domNode)) {
        return this.domNode.length
      } else if (this.domNode) {
        return 1
      } else {
        return 0
      }
    }
  };
  node.__proto__ = DomNode.prototype;
  return node
}

class DomNode {
  constructor(dom) {
    this.domNode = domNode
  }
  /** find有差异 */
  find(node) {
    if (node instanceof DomNode) {
      node = node.domNode
    }
    if (typeof node === 'string') {
      return $(this.domNode.querySelectorAll(node));
    } else if (node.id){
      return $(this.domNode.querySelectorAll('#'+node.id));
    } else {
      let tmpNodes = this.domNode.querySelectorAll(node.tagName + '.' + node.classList.join('.'));
      for (let i = 0; i < tmpNodes.length; i++) {
        if (tmpNodes[i] === node) {
          return $(node)
        }
      }
      return $('')
    }
  }
  insertAfter(dom) {
    if (typeof dom === 'string') {
      dom = $(dom).domNode
    } else if (dom instanceof DomNode) {
      dom = dom.domNode
    }
    let parent = dom.parentNode;
    if (dom.nextSibling) {
      parent.insertBefore(this.domNode, dom.nextSibling);
    } else {
      parent.appendChild(this.domNode);
    }
  }
  insertBefore(dom) {
    if (typeof dom === 'string') {
      dom = $(dom).domNode
    } else if (dom instanceof DomNode) {
      dom = dom.domNode
    }
    dom.parentNode.insertBefore(this.domNode, dom)
  }
  before(){

  }
  after() {

  }
  /**
   * 将传入的dom append 到当前节点的末尾
   */
  append(dom) {
    if (typeof dom === 'string') {
      dom = $(dom).domNode;
    } else if (dom instanceof DomNode) {
      dom = dom.domNode;
    }
    this.domNode.appendChild(dom);
    return this;
  }
  appendTo(parent) {
    if (parent instanceof DomNode) {
      parent = parent.domNode;
    }
    parent.appendChild(this.domNode);
    return this;
  }
  replaceWith(dom) {
    if (typeof dom === 'string') {
      dom = $(dom).domNode
    }
    $(dom).insertBefore(this.domNode)
    this.remove();
    return this;
  }
  /**
   * 从当前节点的父级移除当前节点
   */
  remove() {
    let p = this.domNode.parent;
    p.removeChild(this.domNode);
    return this;
  }
  detach() {
    return this.remove()
  }
  /**
   * 添加class, 可以是多个参数
   * @param {*} classNames 
   */
  addClass(className) {
    this.domNode.classList.add(...arguments);
    return this;
  }
  /**
   * 删除class
   * @param {*} classNames 
   */
  removeClass(className) {
    this.domNode.classList.remove(...arguments);
    return this;
  }
  toggleClass(className, bool) {
    this.domNode.classList.toggle(className, bool);
    return this;
  }
  /**
   * 设置class,  可以是多个参数
   * @param {Array<String>} classNames 
   */
  setClass(className) {
    this.domNode.className = Array.prototype.slice.apply(arguments).join(' ');
    return this;
  }
  /**
   * get css properties
   * style(key)
   * style(k1, k2, k3, k4)
   */
  style(key) {
    let styles = window.getComputedStyle(this.domNode);
    let res = {}
    let ll = arguments.length
    if (ll === 1) {
      return styles.getPropertyValue(key)
    } else {
      for (let i = 0; i < ll; i++) {
        let k = arguments[i];
        res[k] = styles.getPropertyValue(k)
      }
      return res
    }
  }
  /**
   * 设置inline style
   * @param {Object} obj 
   */
  css(obj) {
    let ds = this.domNode.style
    if (arguments.length == 2) {
      let v = arguments[1]
      if (typeof v === 'number') {
        v += 'px'
      }
      ds[arguments[0]] = v;
      return this;
    } else if (arguments.length === 1 && typeof obj == string) {
      // get css
      this.style(obj);
    } else {
      for (let i in obj) {
        let v = obj[i];
        if (typeof v === 'number') {
          v += 'px';
        }
        ds[i] = v;
      }
      return this;
    }
  }
  attr(key, value) {
    if (value == undefined) {
      if (typeof key === 'string') {
        // get attr
        this.domNode.getAttribute(key);
      } else {
        // set attr by obj
        for (let k in key) {
          this.domNode.setAttribute(k, key[k]);
        }
        return this;
      }
    } else {
      // set single attr
      this.domNode.setAttribute(key, value);
      return this;
    }
  }
  /**
   * width方法返回的是元素的内容宽度，不包括padding和border。
   * outerWidth方法返回的是元素的内容宽度加上padding和border宽度，不包括margin。
   * outerWidth(true)方法返回的是元素的内容宽度加上padding、border和margin宽度。
   */
  width() {
    let elStyles = this.style('paddingLeft', 'paddingRight');
    return this.domNode.clientWidth - parseFloat(elStyles.paddingLeft) - parseFloat(elStyles.paddingRight);
  }
  height() {
    let elStyles = this.style('paddingTop', 'paddingBottom');
    return this.domNode.clientHeight - parseFloat(elStyles.paddingTop) - parseFloat(elStyles.paddingBottom);
  }
  innerWidth() {
    return this.domNode.clientWidth;
  }
  innerHeight() {
    return this.domNode.clientHeight;
  }
  outerWidth(bool) {
    if (bool) {
      let elStyles = this.style('marginLeft', 'marginRight');
      return this.domNode.offsetWidth + parseFloat(elStyles.marginLeft) + parseFloat(elStyles.marginRight);
    } else {
      return this.domNode.offsetWidth
    }
  }
  outerHeight(bool) {
    if (bool) {
      let elStyles = this.style('marginTop', 'marginBottom');
      return this.domNode.offsetHeight + parseFloat(elStyles.marginTop) + parseFloat(elStyles.marginBottom);
    } else {
      return this.domNode.offsetHeight
    }
  }
  offsetParent() {
    var offsetParent = this.domNode.offsetParent;

    while ( offsetParent && $(offsetParent).style("position") === "static" ) {
      offsetParent = offsetParent.offsetParent;
    }
    return  offsetParent || document.documentElement;
  }
  /**
   * get or set positon of dom
   * relative to offsetParent node
   */
  position() {
    let offsetParent, offset, doc,
			elem = this.domNode,
			parentOffset = { top: 0, left: 0 };

    let  elemStyles = this.style('position', 'marginTop', 'marginLeft')
		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( elemStyles.position === "fixed" ) {
			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();
		} else {
			offset = this.offset();
			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				$(offsetParent).style('position') === "static" ) {
				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {
				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = $(offsetParent).offset();
        let styles = $(offsetParent).style('borderTopWidth', 'borderLeftWidth')
				parentOffset.top += parseFloat(styles.borderTopWidth);
				parentOffset.left +=  parseFloat(styles.borderLeftWidth);
			}
		}
		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - parseFloat(elemStyles.marginTop),
			left: offset.left - parentOffset.left - parseFloat(elemStyles.marginLeft)
		};
  }
  /**
   * absolute offset to page
   * get offset of dom
   * elem.offset()
   * or set offset()
   * elem.offset({top: 120, left: 100})
   */
  offset() {
    let node = this.domNode;
    if (arguments.length == 1) {
      let options = arguments[0]
      let curOffset = curElem.offset();
      let elemStyles = this.style('top', 'left')
      let curCSSTop = parseFloat(elemStyles.top);
      let curCSSLeft = parseFloat(elemStyles.left);
      let position = elem.style.position;
      let calculatePosition = ( position === 'absolute' || position === 'fixed' ) &&
        ( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;
      let curPosition, curTop, curLeft, props = {};
      // Need to be able to calculate position if either
      // top or left is auto and position is either absolute or fixed
      if ( calculatePosition ) {
        curPosition = curElem.position();
        curTop = curPosition.top;
        curLeft = curPosition.left;
      } else {
        curTop = curCSSTop || 0;
        curLeft = curCSSLeft || 0;
      }

      if ( options.top != null ) {
        props.top = ( options.top - curOffset.top ) + curTop;
        node.top = props.top + 'px';
      }
      if ( options.left != null ) {
        props.left = ( options.left - curOffset.left ) + curLeft;
        node.left = props.left + 'px';
      }
      return this;
    } else {
      // Return zeros for disconnected and hidden (display: none) elements (gh-2310)
      // Support: IE <=11+
      // Running getBoundingClientRect on a
      // disconnected node in IE throws an error
      if ( !node.getClientRects().length ) {
        return { top: 0, left: 0 };
      }
      // Get document-relative position by adding viewport scroll to viewport-relative gBCR
      let rect = node.getBoundingClientRect();
      let win = node.ownerDocument.defaultView;
      return {
        top: rect.top + win.pageYOffset,
        left: rect.left + win.pageXOffset
      };
    }
  }
  /**
   * 绑定事件
   * @param {String} event 
   * @param {Function(evt)} callback(evt)
   *      evt {Object}
   *        - button
            - preventDefault()
   */
  on(event, callback) {
    this.domNode.addEventListener(event, function (evt) {
      // TODO prepare event
      callback(evt);
    });
    return this;
  }
  /**
   * 取消事件监听
   * @param {*} event 
   * @param {*} callback 
   */
  off(event, callback) {
    let argl = arguments.length;
    if (argl <= 1) {
      let evts = getEventListeners(this.domNode);
      if (!evts) {
        return
      }
      if (argl === 0) {
        for (let e in evts) {
          evts[e].forEach((handler) => {
            this.domNode.removeEventListener(e, handler);
          })
        }
      } else {
        evts[event].forEach((handler) => {
          this.domNode.removeEventListener(event, handler);
        })
      }
    } else {
      this.domNode.removeEventListener(event, callback);
    }
    return this;
  }
  /**
   * 
   * @param {*} targetProperties 
   * @param {Number} duration   ms
   * @param {fn} easingFunction 
   * @param {fn} callback 
    $(this.wrapper).animate({
        top: offsetY,
        left: offsetX,
      }, time, () => {
        resolve();
      });
   */
  animate(targetProperties, duration, easing, callback) {
    let startValues = {};
    let properties = Object.keys(targetProperties);
    properties.forEach((property) => {
      startValues[property] = parseFloat(getComputedStyle(element)[property]);
    });
    let ll = arguments.length;
    if (ll === 1) {
      duration = 500;
      easing = swing;
    } else if (ll === 2) {
      easing = swing;
    } else if (ll == 3) {
      if (typeof easing === 'function') {
        callback = easing;
        easing = swing;
      }
    }
    // 从毫秒数换算成帧数
    duration = Math.floor(duration / 1000 * 60); // 每秒60帧
  
    let startTime = null;
    function step(currentTime) {
      if (startTime === null) {
        startTime = currentTime;
      }
      let timeElapsed = currentTime - startTime;
      let progress = Math.min(timeElapsed / duration, 1);
      let easingValue = easingFunction(progress);
      properties.forEach((property) => {
        let startValue = startValues[property];
        let targetValue = targetProperties[property];
        let currentValue = startValue + (targetValue - startValue) * easingValue;
        element.style[property] = `${currentValue}px`;
      });
  
      if (timeElapsed < duration) {
        requestAnimationFrame(step);
      } else {
        callback && callback();
      }
    }
    requestAnimationFrame(step);
  }
  each(fn){
    if (!this.domNode) {
      return;
    }
    this.domNode.forEach((node) => {
      fn($(node));
    });
  }
}
/**
 * 创建dom节点
 * @param {Object} obj
 *    tag {String} 标签名字
 *    css {Object}
 *    attr {Object}
 *    classNames {Array<String>}
 *    text {String} 节点内容
 *    children {Array<DomNode>}
 */
$.create = function (obj) {
  let node = $(document.createElement(obj.tag))
  if (obj.css) {
    node.css(obj.css);
  }
  if (obj.attr) {
    for (let i in obj.attr) {
      node.attr(i, obj.attr[i]);
    }
  }
  if (obj.classNames) {
    node.setClass(...obj.classNames)
  }
  if (obj.text) {
    node.domNode.innerText = text;
  }
  if (obj.children) {
    obj.children.forEach((node) => {
      node.append(node)
    })
  }
  return node;
};

module.exports = $;
