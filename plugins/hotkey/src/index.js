import { transformCode } from './codemap';
class HotKeyPlugins {
  constructor() {
    this.addCanvas = {};
    this.hotkeyFromConfig = {};
    this.selectedItems = {
      nodes: [],
      edges: [],
      groups: [],
    };
    this.copyItems = {};
  }

  register = (obj) => {
    if (!obj.canvas) {
      console.warn('register数据canvas字段不存在=>', obj);
      return;
    }
    if (!obj.root) {
      console.warn('register数据root字段不存在=>', obj);
      return;
    }
    this.canvas = obj.canvas;
    this.hotkeyFromConfig = obj.config || [];
    obj.root.addEventListener('keydown', this.handleKeydown);
    obj.canvas.on('events', this._updateSelectedItem);
  };

  _unfocus = () => {
    if(this.selectedItems.nodes.length !== 0){
      this.selectedItems.nodes.forEach(ele=>ele.unfocus())
    }
    if(this.selectedItems.edges.length !== 0){
      this.selectedItems.edges.forEach(ele=>ele.unfocus())
    }
    if(this.selectedItems.groups.length !== 0){
      this.selectedItems.groups.forEach(ele=>ele.unFocus())
    }
  }

  // 如果监听到的是nodes edges groups 和 canvas事件 则对选中状态进行存储
  _updateSelectedItem = async (args) => {
    const { type } = args;
    switch (type) {
      case 'node:click': {
        this._unfocus()
        args.node.focus()
        this.selectedItems = {
          nodes: [args.node],
          edges: [],
          groups: [],
        };
        break;
      }
      case 'link:click': {
        this._unfocus()
        args.edge.focus()
        this.selectedItems = {
          nodes: [],
          edges: [args.edge],
          groups: [],
        };
        break;
      }
      case 'group:click': {
        this._unfocus()
        args.group.focus()
        this.selectedItems = {
          nodes: [],
          edges: [],
          groups: [args.group],
        };
        break;
      }
      case 'canvas:click': {
        this._unfocus()
        this.selectedItems = {
          nodes: [],
          edges: [],
          groups: [],
        };
        break;
      }
    }
  };

  handleKeydown = (e) => {
    e.preventDefault()
    const { target } = e;
    const { tagName } = target || {};
    const keyCode = e.keyCode || e.which || e.charCode;
    const ctrlKey = e.ctrlKey === true ? 17 : 'T';
    const metaKey = e.metaKey === true ? 91 : 'T';
    const altKey = e.altKey === true ? 18 : 'T';
    const shiftKey = e.shiftKey === true ? 16 : 'T';
    if (
      tagName !== 'INPUT' &&
      tagName !== 'TEXTAREA' &&
      !target.hasAttribute('contenteditable')
    ) {
      const pressedKey = `${ctrlKey}-${metaKey}-${altKey}-${shiftKey}-${keyCode}`
      // 现有的方法
      const keyMapper = {
        '17-T-T-16-90': this.onRedo,
        'T-91-T-16-90': this.onRedo,
        '17-T-T-T-90': this.onUndo,
        'T-91-T-T-90': this.onUndo,
        '17-T-T-T-68': this.onDelete,
        'T-91-T-T-68': this.onDelete,
        'T-T-T-T-8':this.onDelete,
        '17-T-T-T-67': this.onCopy,
        'T-91-T-T-67': this.onCopy,
        '17-T-T-T-86': this.onPaste,
        'T-91-T-T-86': this.onPaste,
        '17-T-T-T-65': this.onSeleteAll,
        'T-91-T-T-65': this.onSeleteAll,
      }
      // 用户自定义的方法
      const customerMapper = {}
      this.hotkeyFromConfig.forEach((ele)=>{
        const customerKey = ele.key.split("+")
        const customerCtrl =  this.hasKey(customerKey,'ctrl') ? transformCode('ctrl') : 'T';
        const customerShift =  this.hasKey(customerKey,'shift') ? transformCode('shift') : 'T';
        const customerAlt = this.hasKey(customerKey,'alt') ? transformCode('alt') : 'T';
        const customerMeta = this.hasKey(customerKey,'command') ? transformCode('command') : 'T';
        const customerKeyCode = transformCode(customerKey[customerKey.length-1]);
        const KeyString  = `${customerCtrl}-${customerMeta}-${customerAlt}-${customerShift}-${customerKeyCode}`
        customerMapper[KeyString] = ele.handler;
      })
      const newKeyMapper = Object.assign({}, keyMapper, customerMapper)
      if(newKeyMapper[pressedKey]){
        return newKeyMapper[pressedKey]();
      }
    }
  };

  hasKey = ( keyArray, keyname ) => {
    return keyArray.indexOf( keyname ) >-1
  }

  onDelete = () => {
    const { nodes, edges, groups } = this.selectedItems;
    if (nodes) { this.canvas.removeNodes(nodes.map((item) => item.id));}
    if (edges) { this.canvas.removeEdges(edges.map((item) => item.id));}
    if (groups) { this.canvas.removeGroups(groups.map((item) => item.id));}
  };

  onUndo = () => {
    this.canvas.undo();
  };

  onRedo = () => {
    this.canvas.redo();
  };

  onCopy = () => {
    this.copyItems = this.selectedItems;
  };

  onPaste = () => {
    if (!this.copyItems) {
      console.log('复制的内容为空');
    }
    if (this.copyItems.nodes) {
      this.copyItems.nodes.forEach(ele=>{
        const { options } = ele;
        const newOptions = {
        ...options,
        id: options.id + '_copy',
        left: options.left + 20,
        top: options.top + 20,
      };
      this.canvas.addNode(newOptions);
    })
  }
};

  onSeleteAll = () => {
    const { nodes, edges, groups } = this.canvas;
    this.selectedItems.nodes = nodes;
    this.selectedItems.edges = edges;
    this.selectedItems.groups = groups;
    // 设置focus样式；
    this.canvas.nodes.forEach(ele=>{
      ele.focus()
    })
    this.canvas.edges.forEach(ele=>{
      ele.focus()
    })
    this.canvas.groups.forEach(ele=>{
      ele.focus()
    })
  };
}

let hotKeyPluginsInstance = new HotKeyPlugins();
export default hotKeyPluginsInstance;