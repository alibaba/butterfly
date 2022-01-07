import _ from 'lodash';
import {Edge} from 'butterfly-dag/dist';


const edgeFactory = (uniqId) => {
  class CustomEdge extends Edge {
    constructor(options) {
      super(options);

      const calcPath = _.get(options, 'options.calcPath');

      if (calcPath && _.isFunction(calcPath)) {
        this.calcPath = calcPath;
      }
    }

    drawLabel() {
      const div = document.createElement('div');

      if (!this.id) {
        this.id = String(Number(new Date()));
      }

      div.id = uniqId + `edge_label_${this.id}`;
      div.className = 'butterflies-label';

      return div;
    }
  }


  return CustomEdge;
};

export default edgeFactory;
