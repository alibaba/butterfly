import React, {Component} from 'react';
import { Canvas } from '../../../../index';
import './app.less';
import '../../../../static/butterfly.css';
const mockData = require('./data');

class Scene extends Component {
  componentDidMount() {
    let root = document.getElementById('dag-canvas');
    this.canvas = new Canvas({
      root: root,
      disLinkable: false, // 可删除连线
      linkable: true,    // 可连线
      draggable: false,   // 可拖动
      zoomable: true,    // 可放大
      moveable: true,    // 可平移
      theme: {
        edge: {
          type: 'Straight'
        }
      }
    });
    this.canvas.draw(mockData, () => {

    });
    this.canvas.on('events', (data) => {
      console.log(data);
    });
  }
  render() {
    return (
      <div className='graphviz'>
        <div className="graphviz-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <Scene />
    </div>
  );
}

export default App;
