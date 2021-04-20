import {getCanvas} from './common/init';

describe('canvas', () => {
  it('init', (done) => {
    const canvas = getCanvas();

    canvas.draw({
      edges: [],
      nodes: [],
      groups: []
    }, () => {
      done();
    });
  });
});