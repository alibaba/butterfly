const _ = require('lodash');
import dagreLayout from './dagreLayout.js';

/**
 * 公共方法：返回节点坐标
 * @param {Array} iNodes 原始节点
 * @param {Array} dagreNodes 有位置的节点
 * @param {Object} basicTl 基础位置
 * @returns {Array} [{id: 节点id, top: top值，left: left值}]
 */
const getNodeTl = (iNodes = [], dagreNodes = [], basicTl) => {
  const pt = [];

  iNodes.forEach(iNode => {
    const item = dagreNodes.find(n => n.id === iNode.id);

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

    pt.push({
      id: iNode.id,
      top: item.top + basic.top,
      left: item.left + basic.left,
      width: item.width,
      height: item.height
    });
  });

  return pt;
};

/**
 * 获取节点坐标
 * group存在的情况
 * STEP1: 找出单独节点&group节点， 单独布局
 * STEP2: group内的节点单独布局
 * @param {Object} initParams 初始数据
 * @param {Object} basicTl 基础位置
 * @returns {nodes, groups} 两种节点的坐标值
 */
const getNodesPosition = (initParams, basicTl) => {
  const params = _.cloneDeep(initParams);
  // 拿到坐标， 重组data
  const {data: initData, ranksep, nodesep, rankdir} = params;
  const [nodesPt, groupsPt] = [[], []];

  // step1: 找出单独节点&group节点， 单独布局
  const aloneNodes = initData.nodes.filter(v => !v.group);
  const aloneGroups = initData.groups.filter(v => !v.group);
  let reLayout = false;

  // 获取group和单节点之间的连线关系
  const groupAloneNodesEdges = getGroupAndAloneNodesEdges(initData);

  const groupData = {
    ...params,
    ranksep,
    nodesep,
    data: {
      nodes: [...aloneNodes, ...aloneGroups],
      edges: groupAloneNodesEdges
    }
  };

  // 拿到group节点坐标
  dagreLayout(groupData);

  // group坐标
  groupsPt.push(...getNodeTl(aloneGroups, groupData.data.nodes, basicTl));

  // 单节点的坐标
  nodesPt.push(...getNodeTl(aloneNodes, groupData.data.nodes, basicTl));

  // STEP2: group内节点布局
  (params.data.groups || []).forEach((group, idx) => {
    const inGroupNodes = initData.nodes.filter(v => v.group === group.id);
    const inGroupNodeEdges = getInGroupNodesEdges(group.id);

    const inGroupDatas = {
      ...params,
      nodesep,
      data: {
        nodes: inGroupNodes,
        edges: inGroupNodeEdges
      }
    };
    dagreLayout(inGroupDatas);

    const tidyNodeData = getNodeTl(params.data.nodes, inGroupDatas.data.nodes);
    // group宽度高度根据节点位置去调整。调整过后要重新布局
    let left, top, right, bottom;
    tidyNodeData.forEach((node) => {
      if (!left || node.left < left) {
        left = node.left;
      }
      if (!top || node.top < top) {
        top = node.top;
      }
      if (!right || inGroupNodes.find(n => n.id === node.id).width + node.left > right) {
        right = node.left + inGroupNodes.find(n => n.id === node.id).width;
      }
      if (!bottom || inGroupNodes.find(n => n.id === node.id).height + node.top > bottom) {
        bottom = node.top + inGroupNodes.find(n => n.id === node.id).height;
      }
    });
    // 期望的group最窄横竖坐标
    if (rankdir && (rankdir === 'LR' || rankdir === 'RL')) {
      top -= nodesep / 2;
      bottom += nodesep / 2;
      left -= ranksep / 2;
      right += ranksep / 2;
    } else {
      top -= ranksep / 2;
      bottom += ranksep / 2;
      left -= nodesep / 2;
      right += nodesep / 2;
    }
    // 宽度是否合适
    if (group.width < (right - left)) {
      group.width = right - left;
      reLayout = true;
    }
    if (group.height < (bottom - top)) {
      group.height = bottom - top;
      reLayout = true;
    }

    // 移动相对坐标
    const relateLeft = (group.width - (right - left)) / 2 - left;
    const relateTop = (group.height - (bottom - top)) / 2 - top;
    if (!reLayout) {
      tidyNodeData.forEach((node) => {
        node.left += relateLeft;
        node.top += relateTop;
      });
    }

    nodesPt.push(...tidyNodeData);
  });

  // 嵌套的groups， 这里的重新编排逻辑之后再加
  const groupIds = _.uniq(initData.groups.filter(g => g.group).map(g => g.group));

  let [inGroupNodesPt, inGroupsGroupsPt] = [[], []];

  if (!_.isEmpty(groupIds)) {
    groupIds.forEach(gId => {
      // 找出嵌套在内层的group与节点
      const inGroups = initData.groups.filter(inG => inG.group === gId);
      // 需要删除group节点的group参数， 不然会死循环
      inGroups.forEach(g => delete g.group);

      const inGroupsIds = inGroups.map(v => v.id);
      const inNodes = initData.nodes.filter(inN => [gId, ...inGroupsIds].includes(inN.group));

      // 嵌套在内的节点位置应该加上外层group的位置
      const basicTl = groupsPt.find(v => v.id === gId);

      const {nodes, groups} = getNodesPosition({
        ...params,
        data: {
          nodes: inNodes,
          groups: inGroups,
          edges: initData.edges
        }
      }, basicTl);

      [inGroupNodesPt, inGroupsGroupsPt] = [nodes, groups];

    });
  }

  if (reLayout) {
    return getNodesPosition(params, basicTl);
  }
  return {
    nodes: [...nodesPt, ...inGroupNodesPt],
    groups: [...groupsPt, ...inGroupsGroupsPt]
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

/**
 * 带group的自由布局算法
 * @param {Object} params 初始数据
 */
function dagreGroupLayout(params) {
  const {data} = params;

  if (_.isEmpty(data.groups)) {
    dagreLayout(params);
    return;
  }

  const pt = getNodesPosition(params);
  
  params.data.nodes.forEach(n => {
    const ptNode = pt.nodes.find(pNode => pNode.id === n.id);

    if (!ptNode) {
      return;
    }

    n.top = ptNode.top;
    n.left = ptNode.left;
    n.width = ptNode.width;
    n.height = ptNode.height;
  });

  params.data.groups.forEach(g => {
    const ptNode = pt.groups.find(gNode => gNode.id === g.id);

    if (!ptNode) {
      return;
    }

    g.top = ptNode.top;
    g.left = ptNode.left;
    g.width = ptNode.width;
    g.height = ptNode.height;
  });
};

// module.exports = dagreGroupLayout;
export default {
  dagreGroupLayout
};
