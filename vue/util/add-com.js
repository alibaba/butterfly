import VueGroup from "../coms/vue-group.vue";
import VueNode from "../coms/vue-node.vue";
import Vue from 'vue';

/**
 * 校验render
 * @param {Function} render 渲染函数
 * @param {String} type 渲染类型
 */
const checkRender = (render, type) => {
  if (!type.render) {
    return null;
  }

  if (typeof render !== 'string') {
    throw Error(`${type}存在render属性，应该为string类型，现在是${typeof render}`);
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

    const dom = document.getElementById("bf_group_" + item.id);

    if (!dom) {
      return;
    }

    checkRender(item.render, "group");

    const groupVueCon = Vue.extend(VueGroup);

    const groupPropsData = {
      id: item.id,
      render: item.render
    }

    const groupCom = new groupVueCon(({
      propsData: groupPropsData
    })).$mount();

    console.log(groupCom.$el, "==>", dom);

    dom.appendChild(groupCom.$el);

  });
};

const addNodesCom = (nodes) => {
  nodes.map((item,index) => {
    const id = item.id;
    if (!id) {
      console.warn(`nodes的${index}不含ID属性，请检查格式`);
      return;
    }

    const dom = document.getElementById("bf_node_" + item.id);

    if (!dom) {
      return;
    }

    checkRender(item.render, "node");

    const nodeVueCon = Vue.extend(VueNode);

    const nodePropsData = {
      id: item.id,
      render: item.render
    }

    const nodeCom = new nodeVueCon(({
      propsData: nodePropsData
    })).$mount();

    console.log(nodeCom.$el, "==>", dom);

    dom.appendChild(nodeCom.$el);
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
      const dom = document.getElementById("edge_label_" + item.id);

      if (!dom) {
        return;
      }

      checkRender(item.render, "edge");

      const edgeVueCon = Vue.extend({
        template: `${item.render}`,
        props: {
          id: {
            type: String,
            required: true,
          }
        },
      });

      const edgePropsData = {
        id: item.id
      }

      const edgeCom = new edgeVueCon(({
        propsData: edgePropsData
      })).$mount();

      console.log(edgeCom.$el, "==>", dom);

      dom.appendChild(edgeCom.$el);
    }
  })
};


export {
  addCom,
  addEdgesCom,
  addGroupsCom,
  addNodesCom
};