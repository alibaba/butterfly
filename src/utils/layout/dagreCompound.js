const buildGraph = require("dagre-compound").buildGraph;

// dagre-compound暂不支持gorup节点定制宽高， 需要将group节点当作node处理
// 文档：https://simple-jason.gitbook.io/user-guide/dc-api
// 算法所需数据结构
/** {
  nodes: [{id: "1"},{id: "2"},{id: "3"},{id: "4"},{id: "5"}],
  edges: [
    { v: "1", w: "7" },{ v: "2", w: "7" },{ v: "3", w: "8" },{ v: "3", w: "9" },{ v: "4", w: "8" },
    { v: "4", w: "9" },{ v: "1", w: "3" },{ v: "2", w: "3" },{ v: "3", w: "4" },{ v: "3", w: "5" }
  ],
  compound: {group1: ["4", "5"],group2: ["1", "2"],group3: ["group2", "3"]}
} */
function dagreCompound (params) {
  const {opts: {rankdir}} = params;
  // 拿到坐标， 重组data
  const initData = params.data;
  const dagreData = _.cloneDeep(initData);

  // edges
  const dagreEdges = (dagreData.edges || []).map(v => {
    const item = v;
    item['v'] = v.source;
    item['w'] = v.target;

    return item;
  });
  dagreData.edges = dagreEdges;

  // 拿到各节点坐标
  const buildGraphData = buildGraph(dagreData, {
    rankDirection: rankdir
  });
  // new nodes
  const finalNodes = [];
  buildGraphData.nodes.forEach(node => {
    const item = initData.nodes.find(n => n.id === node.id);

    if (!item) {
      return;
    }

    item.left = node.x;
    item.top = node.y;

    finalNodes.push(item);
  });
  // new groups
  // 需要将groups与非group内的节点一块计算坐标
  if (!_.isEmpty(dagreData.groups)) {
    const noGroupNodes = dagreData.nodes.filter(v => !v.group);
    const groupData = {
      nodes: [...noGroupNodes, ...dagreData.groups],
      edges: []
    };
  
    // 拿到group节点坐标
    const groupGraphData = buildGraph(groupData, {
      rankDirection: rankdir
    });
    // group坐标赋值
    (params.data.groups || []).forEach(initGroup => {
      const item = groupGraphData.nodes.find(n => n.id === initGroup.id);
  
      if (!item) {
        return;
      }

      initGroup.top = item.y;
      initGroup.left = item.x;
    });

    // 修改非group节点的坐标
    noGroupNodes.forEach(node => {
      const item = groupGraphData.nodes.find(n => n.id === node.id);
      const nodeIndex = finalNodes.findIndex(f => f.id === node.id);

      if (nodeIndex === -1) {
        return;
      }

      finalNodes[nodeIndex].top = item.y;
      finalNodes[nodeIndex].left = item.x;

    });

  }
  
  params.data.nodes = finalNodes;
}

module.exports = dagreCompound;
