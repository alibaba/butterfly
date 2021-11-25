import {Canvas} from '../../index.js';

export const getCanvas = () => {
  const div = document.createElement('div');
  const dom = document.getElementById('root');
  dom.appendChild(div);

  let canvas = new Canvas({
    root: div,
    zoomable: true,
    moveable: true,
    draggable: true
  });

  return canvas
};
