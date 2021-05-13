import VueGroup from '../coms/vue-group.vue';
import VueNode from '../coms/vue-node.vue';
import Vue from 'vue';
import _ from 'lodash';

/**
 * 校验render
 * @param {Object} item 渲染对象（就是mockdata中的每一项）
 * @param {String} type 渲染类型
 * @param {Array} canvasNodes 渲染节点对应的渲染类型
 */
 const render = (item, type, canvasNodes = null) => {

  let vueCon;

  if (item.render) {
    switch (typeof item.render) {
      case 'string':
        vueCon = Vue.extend({
          template: item.render,
          props:{
            nodeData: {
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
    nodeData: item,
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

    // propsData.canvasNode = canvasNode;
  
    const nodeCon = new vueCon({
      propsData
    }).$mount();
  
    addUserEndpoint(canvasNode,nodeCon._vnode);
    
    return nodeCon;
  }
  else {
    const Con = new vueCon({
      propsData
    }).$mount();
    
    return Con;
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
    canvasNode.addEndpoint({
      id,
      dom,
    })
    return;
  }

  if (!_.isUndefined(children)) {
    for(let VNodeChildren of children){
      addUserEndpoint(canvasNode,VNodeChildren);
    }
  }
};

const addCom = (proData) => {
  addGroupsCom(proData.groups);
  addNodesCom(proData.nodes);
};

const addGroupsCom = (groups) => {
  groups.map((item,index) => {
    const id = item.id;
    if (!id) {
      console.warn(`groups的${index}不含ID属性，请检查格式`);
      return;
    }

    const dom = document.getElementById('bf_group_' + item.id);

    if (!dom) {
      return;
    }

    let groupCon = render(item, 'group');

    dom.appendChild(groupCon.$el);

  });
};

const addNodesCom = (canvasNodes,nodes) => {
  nodes.map((item,index) => {
    const id = item.id;
    if (!id) {
      console.warn(`nodes的${index}不含ID属性，请检查格式`);
      return;
    }

    const dom = document.getElementById('bf_node_' + item.id);

    if (!dom) {
      return;
    }

    let nodeCon = render(item, 'node', canvasNodes);

    dom.appendChild(nodeCon.$el);
  })
};

const addEdgesCom = (edges) => {
  edges.map((item,index) => {
    const id = item.id;
    if (!id) {
      console.warn(`edges的${index}不含ID属性，请检查格式`);
      return;
    }

    if (item.render) {
      const dom = document.getElementById('edge_label_' + item.id);

      if (!dom) {
        return;
      }

      let edgeCon = render(item, 'edge');

      dom.appendChild(edgeCon.$el);
    }
  })
};


export {
  addCom,
  addEdgesCom,
  addGroupsCom,
  addNodesCom
};