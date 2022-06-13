'use strict';

import Node from './node';
import Edge from './edge';
import {graphviz} from 'd3-graphviz';

const graphvizLayout = (treeData) => {
  const refactDataToString = (data) => {
    const nodes = {};
    const result = [];
    data.nodes.forEach(n => {
      nodes[n.id] = n.name;
      result.push(`${n.name} [width=${n.width ? n.width * 0.010416 * 2.5 : 2.5}]`)
    })
    data.edges.forEach(e => {
      result.push(`${nodes[e.source]} -> ${nodes[e.target]};`)
    })
    return result;
  }
  
  const str = refactDataToString(treeData);
  const theGraphviz = graphviz(`body`);
  theGraphviz
    .options({
      fit: false,
      zoom: false,
    })
    .dot(`digraph {
      ${str.join('\n')}
    }`)
  
  const computedData = theGraphviz.data().children[1].children;
  const nodes = [];
  const edges = [];
  
  computedData.forEach(d => {
    if (d.attributes.class === 'node') {
      nodes.push({
        id: treeData.nodes.find(n => n.name === d.key).id,
        label: d.key,
        top: parseFloat(d.children.find((c) => c.tag === 'ellipse').center.y),
        left: parseFloat(d.children.find((c) => c.tag === 'ellipse').center.x),
        height: parseFloat(d.children.find((c) => c.tag === 'ellipse').attributes.ry) * 2,
        width: parseFloat(d.children.find((c) => c.tag === 'ellipse').attributes.rx)
      });
    }
    if (d.attributes.class === 'edge') {
      edges.push({
        source: d.key.split('->')[0],
        target: d.key.split('->')[1],
        path: d.children.find((c) => c.tag === 'path').attributes.d,
        totalLength: d.children.find((c) => c.tag === 'path').totalLength
      });
    }
  })
  
  const selfNodes = nodes.map(n => {
    const res = {};
    res.draggable = true;
    res.id = n.id;
    res.label = n.label;
    res.top = n.top;
    res.left = n.left;
    res.width = n.width;
    res.height = n.height;
    res.Class = Node;
    res.endpoints = [{
      id: 'down',
      orientation: [0, 1],
      pos: [0.5, 1]
    }, {
      id: 'up',
      orientation: [0, -1],
      pos: [0.5, 1]
    }];
    return res;
  });
  const selfEdges = edges.map(e => {
    const res = {};
    const trueSource = nodes.find(n => n.label === e.source);
    const trueTarget = nodes.find(n => n.label === e.target);
    res.type = 'endpoint';
    res.source = 'down';
    res.target = 'up';
    res.trueSource = trueSource;
    res.trueTarget = trueTarget;
    res.sourceNode = trueSource.id;
    res.targetNode = trueTarget.id;
    res.d = e.path;
    res.totalLength = e.totalLength;
    res.arrow = true;
    res.Class = Edge;
    return res;
  });
  return {
    nodes: selfNodes,
    edges: selfEdges
  };
}


export default graphvizLayout;
