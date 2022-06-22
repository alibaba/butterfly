'use strict';

import {graphviz} from 'd3-graphviz';
import Edge from './edge';

const graphvizLayout = (params) => {
  const refactDataToString = () => {
    const {data} = params;
    const nodes = {};
    const result = [];
    for (let cc of Object.keys(params)) {
      if (cc === 'data') {
        continue;
      }
      result.push(`${cc} = ${params[cc]};`);
    }
    const widthBonus = params.rankdir === 'LR' || params.rankdir === 'RL' ? 2 : 2.5;
    const heightBonus = params.rankdir === 'LR' || params.rankdir === 'RL' ? 2.5 : 2;
    data.nodes.forEach(n => {
      nodes[n.id] = n.label;
      result.push(`${n.label} [width=${n.width ? n.width * 0.010416 * widthBonus : widthBonus}, height=${n.height ? n.height * 0.010416 * heightBonus : heightBonus}]`)
    })
    // edge去重
    const pathDic = {};
    data.edges.forEach(e => {
      if (e.sourceNode) {
        if (!pathDic[`${nodes[e.sourceNode]} -> ${nodes[e.targetNode]};`]) {
          pathDic[`${nodes[e.sourceNode]} -> ${nodes[e.targetNode]};`] = true;
          pathDic[`${nodes[e.sourceNode]} -> ${nodes[e.targetNode]};`] && result.push(`${nodes[e.sourceNode]} -> ${nodes[e.targetNode]};`)
        }
      } else {
        if (!pathDic[`${nodes[e.source]} -> ${nodes[e.target]};`]) {
          pathDic[`${nodes[e.source]} -> ${nodes[e.target]};`] = true;
          pathDic[`${nodes[e.source]} -> ${nodes[e.target]};`] && result.push(`${nodes[e.source]} -> ${nodes[e.target]};`)
        }
      }
    })
    return result;
  }
  
  const str = refactDataToString();
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
  
  computedData.forEach(d => {
    if (d.attributes.class === 'node') {
      const parseNode = params.data.nodes.find(n => n.label === d.key);
      parseNode.top = parseFloat(d.children.find((c) => c.tag === 'ellipse').center.y);
      parseNode.left = parseFloat(d.children.find((c) => c.tag === 'ellipse').center.x);
      if (!parseNode.width) {
        parseNode.width = parseFloat(d.children.find((c) => c.tag === 'ellipse').attributes.rx)
      }
      if (!parseNode.height) {
        parseNode.height = parseFloat(d.children.find((c) => c.tag === 'ellipse').attributes.ry) * 2;
      }
    }
    if (d.attributes.class === 'edge') {
      const parseEdges = params.data.edges.filter(e => {
        const sourceId = params.data.nodes.find(n => n.label === d.key.split('->')[0]).id;
        const targetId = params.data.nodes.find(n => n.label === d.key.split('->')[1]).id
        if ((e.sourceNode === sourceId && e.targetNode === targetId) ||
          (e.source === sourceId && e.target === targetId)) {
          return true;
        }
      });
      parseEdges.forEach(parseEdge => {
        parseEdge.shapeType = 'Bezier';
        parseEdge.d = d.children.find((c) => c.tag === 'path').attributes.d;
      });
    }
  })
  // 为node赋予level
  if (!params.rankdir || params.rankdir === 'TB' || params.rankdir === 'BT') {
    const levelObj = {};
    params.data.nodes.forEach(n => {
      if (!levelObj[n.top]) {
        levelObj[n.top] = [n];
      } else {
        levelObj[n.top].push(n);
      }
    });
    const levelPri = Object.keys(levelObj);
    levelPri.sort((a, b) => {
      return parseFloat(a) > parseFloat(b)
    });
    for (let cc = 0; cc < levelPri.length; cc++) {
      levelObj[levelPri[cc]].forEach(n => {
        n.level = !params.rankdir || params.rankdir === 'TB' ? cc + 1 : levelPri.length - cc;
      })
    }
  } else {
    const levelObj = {};
    params.data.nodes.forEach(n => {
      if (!levelObj[n.left]) {
        levelObj[n.left] = [n];
      } else {
        levelObj[n.left].push(n);
      }
    });
    const levelPri = Object.keys(levelObj);
    levelPri.sort((a, b) => {
      return parseFloat(a) > parseFloat(b)
    });
    for (let cc = 0; cc < levelPri.length; cc++) {
      levelObj[levelPri[cc]].forEach(n => {
        n.level = params.rankdir === 'LR' ? cc + 1 : levelPri.length - cc;
      })
    }
  }
  return params;
}


export default graphvizLayout;
export {Edge as GraphvizEdge};
