import Vue from 'vue';
import $ from 'jquery';
import _ from 'lodash';

import VueGroup from '../coms/vue-group.vue';
import VueNode from '../coms/vue-node.vue';

/**
 * 渲染render
 * @param {Object} item 渲染对象（就是mockdata中的每一项）
 * @param {String} type 渲染类型
 * @param {Array} canvasNodes 渲染节点对应的渲染类型
 */
const render = (item, type, parent = null, canvasNodes = null) => {

  let vueCon;

  if (item.render) {
    switch (typeof item.render) {
      case 'string':
        vueCon = Vue.extend({
          template: item.render,
          props:{
            itemData: {
              type: Object,
              required: true,
            }
          },
        });
        break;

      case 'object':
        vueCon = Vue.extend(item.render);
        break;

      default:
        throw Error(`${type}存在render属性，应该为string或者object类型，现在是${typeof render}`);
    }
  } else {
    switch (type) {
      case 'group':
        vueCon = Vue.extend(VueGroup);
        break;

      case 'node':
        vueCon = Vue.extend(VueNode);
        break;

      default:
        break;
    }
    
  }

  let propsData = {
    itemData: item,
  }

  if (type === 'node') {
    let canvasNodeIndex = canvasNodes.findIndex((node)=>{
      return node.id === item.id;
    })
  
    if (canvasNodeIndex === -1) {
      console.warn(`canvas.addNodes方法出错`);
      return null;
    }
  
    let canvasNode = canvasNodes[canvasNodeIndex];

    propsData.canvasNode = canvasNode;
  
    const nodeCon = new vueCon({
      propsData
    });
    // 暂时不用指向parent 节点的emit支持
    // nodeCon.$parent = parent
    // 打通组件的$emit事件传输
    nodeCon._events = parent._events;
    nodeCon.$mount();
    
    return nodeCon;
  }
  else {
    const Con = new vueCon({
      propsData
    })
    // 暂时不用指向parent  edge和group的emit支持
    // Con.$parent = parent
    // 打通组件的$emit事件传输
    Con._events = parent._events;
    Con.$mount();
    
    return Con;
  }

};

// 一些UI组件的渲染方式的补充
const addUserEndpointByComponentInstance = (canvasNode, ComponentInstance) => {
  let options = ComponentInstance.$options;
  let componentTag = options && options._componentTag;
  let componentInstanceChildrens = ComponentInstance.$children;

  if (componentTag === 'butterfly-vue-endpoint') {
    let dom = ComponentInstance.$el;
    let id = dom.id;
    let param = ComponentInstance.param;
    canvasNode.addEndpoint({
      id,
      dom,
      ...param
    })
    return;
  }

  for (let componentInstanceChildren of componentInstanceChildrens) {
    addUserEndpointByComponentInstance(canvasNode, componentInstanceChildren)
  }

};

const addUserEndpoint = (canvasNode,VNode) => {
  let VNodeTemp = VNode;
  let tag = VNodeTemp.tag;
  let children = VNodeTemp.children;

  // 当虚拟树节点到达底部
  if (_.isUndefined(tag)) {
    return;
  }

  // 找到自定义节点
  if (tag.search('butterfly-vue-endpoint') !== -1) {
    let dom = VNodeTemp.elm;
    let id = dom.id;
    let param = VNodeTemp.componentInstance.param;
    canvasNode.addEndpoint({
      id,
      dom,
      ...param
    })
    return;
  }

  let componentInstance = VNodeTemp.componentInstance;
  if (!_.isUndefined(componentInstance)) {
    let componentInstanceChildrens = componentInstance.$children;
    for (let componentInstanceChildren of componentInstanceChildrens) {
      addUserEndpointByComponentInstance(canvasNode, componentInstanceChildren)
    }
  }

  if (!_.isUndefined(children)) {
    for (let VNodeChildren of children) {
      addUserEndpoint(canvasNode,VNodeChildren);
    }
  }
};

const addCom = (proData) => {
  addGroupsCom(proData.groups);
  addNodesCom(proData.nodes);
};

const addGroupsCom = (canvasRoot, groups, parent) => {
  groups.map((item,index) => {
    const id = item.id;
    if (!id) {
      console.warn(`groups的${index}不含ID属性，请检查格式`);
      return;
    }

    const dom = $(canvasRoot).find(`*[id^='bf_group_${item.id}']`);

    if (!dom) {
      return;
    }

    let groupCon = render(item, 'group', parent);

    dom.append(groupCon.$el);

  });
};

const addNodesCom = (canvasRoot, canvasNodes, nodes, parent) => {
  nodes.map((item,index) => {
    if (_.isArray(item)) {
      return ;
    }
    const id = item.id;
    if (!id) {
      console.warn(`nodes的${index}不含ID属性，请检查格式`);
      return;
    }

    const dom = $(canvasRoot).find(`*[id^='bf_node_${item.id}']`);

    if (!dom) {
      return;
    }

    let nodeCon = render(item, 'node', parent, canvasNodes);

    dom.append(nodeCon.$el);

    // 需要先挂载锚点才可以添加锚点
    let canvasNodeIndex = canvasNodes.findIndex((node)=>{
      return node.id === item.id;
    })
  
    if (canvasNodeIndex === -1) {
      console.warn(`canvas.addNodes方法出错`);
      return null;
    }
  
    let canvasNode = canvasNodes[canvasNodeIndex];
    addUserEndpoint(canvasNode,nodeCon._vnode);
  })
};

const addEdgesCom = (canvasRoot, edges, parent) => {
  edges.map((item,index) => {
    const id = item.id;
    if (!id) {
      console.warn(`edges的${index}不含ID属性，请检查格式`);
      return;
    }

    if (item.render) {
      const dom = $(canvasRoot).find(`*[id^='edge_label_${item.id}']`);

      if (!dom) {
        return;
      }

      let edgeCon = render(item, 'edge', parent);

      dom.append(edgeCon.$el);
    }
  })
};

export {
  addCom,
  addEdgesCom,
  addGroupsCom,
  addNodesCom
};
