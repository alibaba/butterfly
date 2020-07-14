const Hierarchy = require('@antv/hierarchy');

function tranlateData(data) {
  let queue = [data];
  let nodeList = [];
  while (queue.length > 0) {
    let node = queue.pop();
    let newNode = node.data;
    newNode.left = node.x;
    newNode.top = node.y;
    newNode.treePos = {
      hgap: node.hgap,
      vgap: node.vgap,
      x: node.x,
      y: node.y,
      depth: node.depth,
      side: node.side
    };
    nodeList.push(newNode);
    queue = queue.concat(node.children);
  }
  return nodeList[0];
}

export default {
  compactBox: (data, options) => {
    return tranlateData(Hierarchy.compactBox(data, options));
  },
  dendrogram: (data, options) => {
    return tranlateData(Hierarchy.dendrogram(data, options));
  },
  indented: (data, options) => {
    return tranlateData(Hierarchy.indented(data, options));
  },
  mindmap: (data, options) => {
    return tranlateData(Hierarchy.mindmap(data, options));
  }
};
