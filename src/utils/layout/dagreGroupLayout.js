const _ = require('lodash');
const dagreLayout = require("./dagreLayout");

// group存在的情况
// STEP1: 找出单独节点&group节点， 单独布局
// STEP2: group内的节点单独布局
const getNodesPosition = (params, basicTl) => {
  console.log('params: ', params);
  // 拿到坐标， 重组data
  const {data: initData, ranksep, nodesep} = params;

  // step1: 找出单独节点&group节点， 单独布局
  const aloneNodes = initData.nodes.filter(v => !v.group);

  // 获取group和单节点之间的连线关系
  const groupAloneNodesEdges = getGroupAndAloneNodesEdges(initData);
  console.log('groupAloneNodesEdges: ', groupAloneNodesEdges);

  const groupData = {
    ...params,
    ranksep,
    nodesep,
    data: {
      nodes: [...aloneNodes, ...initData.groups],
      edges: groupAloneNodesEdges
    }
  };

  // 拿到group节点坐标
  dagreLayout(groupData);

  // group坐标赋值
  (params.data.groups || []).forEach(initGroup => {
    const item = groupData.data.nodes.find(n => n.id === initGroup.id);

    if (!item) {
      return;
    }

    let basic = {
      top: 0,
      left: 0
    }
    if (basicTl) {
      basic = basicTl;
    }

    initGroup.top = item.top + basic.top;
    initGroup.left = item.left + basic.left;
  });

  // 修改单节点的坐标
  aloneNodes.forEach(node => {
    const item = groupData.data.nodes.find(n => n.id === node.id);
    const nodeIndex = params.data.nodes.findIndex(f => f.id === node.id);

    if (nodeIndex === -1) {
      return;
    }


    let basic = {
      top: 0,
      left: 0
    }
    if (basicTl) {
      basic = basicTl;
    }

    params.data.nodes[nodeIndex].top = item.top + basic.top;
    params.data.nodes[nodeIndex].left = item.left + basic.left;

  });

  // STEP2: group内节点布局
  (params.data.groups || []).forEach((group, idx) => {
    const inGroupNodes = initData.nodes.filter(v => v.group === group.id);
    const inGroupNodeEdges = getInGroupNodesEdges(group.id);
    console.log('inGroupNodeEdges: ', inGroupNodeEdges);
    const inGroupDatas = {
      ...params,
      nodesep,
      data: {
        nodes: inGroupNodes,
        edges: inGroupNodeEdges
      }
    };
    dagreLayout(inGroupDatas);

    inGroupDatas.data.nodes.forEach(node => {
      const nodeIndex = params.data.nodes.findIndex(f => f.id === node.id);

      if (nodeIndex === -1) {
        return;
      }

      params.data.nodes[nodeIndex].top = node.top;
      params.data.nodes[nodeIndex].left = node.left;
    });
  });

  // 嵌套的groups
  let groupIds = [];

  initData.groups.forEach(g => {
    if (g.group) {
      groupIds.push(g.group);
    }
  });
  groupIds = _.uniq(groupIds);
  console.log('groupIds: ', groupIds);

  if (!_.isEmpty(groupIds)) {
    const inGroupNodes = {};
    groupIds.forEach(gId => {
      // 找出嵌套在内层的group与节点
      const inGroups = initData.groups.filter(inG => inG.group === gId);
      // 需要删除group节点的group参数， 不然会死循环
      inGroups.forEach(g => delete g.group);

      const inGroupsIds = inGroups.map(v => v.id);
      const inNodes = initData.nodes.filter(inN => [gId, ...inGroupsIds].includes(inN.group));

      inGroupNodes[gId] = {
        inGroups, inNodes
      }
      const basicTl = params.data.groups.find(v => v.id === gId);

      getNodesPosition({
        ...params,
        data: {
          nodes: inNodes,
          groups: inGroups,
          edges: initData.edges
        }
      }, basicTl);
    });
  }
};

/**
 * 获取group以及单节点之间的连线关系
 * @param {Object} data 
 * @param {Array} data.nodes
 * @param {Array} data.edges
 * @param {Array} data.groups
 * @returns [{source: "group1", target: "node-id"}, {source: "node-id", target: "group2"}]
 */
const getGroupAndAloneNodesEdges = (data) => {
  const {nodes = [], edges = [], groups = []} = data;
  const groupAloneNodesEdges = [];

  // groups与单节点之间的关系
  groups.forEach(g => {
    const groupItemNodes = nodes.filter(n => n.group === g.id);
    groupItemNodes.forEach(iNode => {
      const sourceEdges = edges.filter(e => String(e.source) === String(iNode.id));
      const targetEdges = edges.filter(e => String(e.target) === String(iNode.id));

      sourceEdges.forEach(s => s.source = g.id);
      targetEdges.forEach(t => t.target = g.id);

      groupAloneNodesEdges.push(...sourceEdges, ...targetEdges);
    })
  });

  // 单节点之间的连线关系
  const aloneNodes = nodes.filter(v => !v.group);

  aloneNodes.forEach(aNode => {
    const sourceEdges = edges.filter(e => String(e.source) === String(aNode.id));
    const targetEdges = edges.filter(e => String(e.target) === String(aNode.id));

    groupAloneNodesEdges.push(...sourceEdges, ...targetEdges);
  })

  return _.uniqWith(groupAloneNodesEdges, _.isEqual);
};
/**
 * 获取group内节点的连线关系
 * @param {Object} data 
 * @param {Array} data.nodes
 * @param {Array} data.edges
 * @param {Number | String} groupId
 */
const getInGroupNodesEdges = (data, groupId) => {
  const {nodes = [], edges = []} = data;

  const nodeEdges = [];
  const inGroupNodes = nodes.filter(n => n.group === groupId);

  inGroupNodes.forEach(igNode => {
    const sourceEdges = edges.filter(e => String(e.source) === String(igNode.id));
    const targetEdges = edges.filter(e => String(e.target) === String(igNode.id));

    nodeEdges.push(...sourceEdges, ...targetEdges);
  })

  return _.uniqWith(nodeEdges, _.isEqual);
};

function dagreGroupLayout(params) {
  const {data} = params;

  if (_.isEmpty(data.groups)) {
    dagreLayout(params);
    return;
  }

  getNodesPosition(params);
  console.log('params: ', params);
};

module.exports = dagreGroupLayout;
