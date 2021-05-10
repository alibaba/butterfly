import {Canvas} from 'butterfly-dag';
import _ from 'lodash';
import './canvas.less';

const EVENTTYPE = {
  NODECLICK: 'node:click',
  CANVASCLICK: 'canvas:click'
};

class IndustryCanvas extends Canvas {
  constructor(...args) {
    super(...args);
    this.listenEventProxy();
  }
  connection(conn) {
    // 拼接数据
    let sourceNode = null;
    let sourceEndpoint = null;
    let targetNode = null;
    let targetEndpoint = null;
    let param = conn.connection.getParameters();
    _.map(param, (val) => {
      let node = this.getNode(val.nodeId);
      let endpoint = _.find(node._endpoint, (point) => {
        return point.id = val.id;
      });
      if (conn.sourceId.toString() === node.id.toString()) {
        sourceNode = node;
        sourceEndpoint = endpoint;
      } else {
        targetNode = node;
        targetEndpoint = endpoint;
      }
    });
    // 考虑把endpoint展示掉
    // sourceEndpoint.isShow = true;
    // targetEndpoint.isShow = true;
    this.edges.push({
      id: sourceEndpoint.id + '-' + targetNode.id,
      sourceNode: sourceNode.id,
      source: sourceEndpoint.id,
      sourcePos: sourceEndpoint.pos,
      targetNode: targetNode.id,
      target: targetEndpoint.id,
      targetPos: targetEndpoint.pos
    });
  }
  listenEventProxy() {
    this.on('events', (data) => {
      if (data.type.indexOf(EVENTTYPE.NODECLICK) !== -1) {
        // 取消所有节点focus
        this._unFocusAllNode();
        let node = data.node;
        node.focus();
      } else if (data.type.indexOf(EVENTTYPE.CANVASCLICK) !== -1) {
        // 取消所有节点focus
        this._unFocusAllNode();
      }
    });
  }
  _unFocusAllNode() {
    this.nodes.forEach((node) => {
      node.unFocus();
    });
  }
}

export default IndustryCanvas;
