import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Button, Select, Slider} from 'antd';

import mockData from './data';
import node from './base_node';
import RelationEdge from './edge';
import DagreCanvas from './dagre-canvas';

import './index.less';
import 'antd/dist/antd.css';
import 'butterfly-dag/dist/index.css';

const Option = Select.Option;
class DagreLayout extends Component {
  constructor() {
    super();
    this.canvas = null;
    this.state = {
      addNodesStatus: true
    };
  }

  componentDidMount() {
    let root = document.getElementById('dag-canvas');
    this.canvas = new DagreCanvas({
      root: root,
      disLinkable: true, // 可删除连线
      linkable: true,    // 可连线
      draggable: true,   // 可拖动
      zoomable: true,    // 可放大
      moveable: true,    // 可平移
      layout: {
        type: 'dagreLayout',
        options: {
          rankdir: 'TB',
          nodesep: 40,
          ranksep: 40,
          controlPoints: false,
        },
      },
      theme: {
        edge: {
          shapeType: 'AdvancedBezier',
          arrow: true,
          arrowPosition: 0.5,
          Class: RelationEdge
        }
      }
    });
    this.canvas.draw(mockData);
  }

  // 添加节点
  addNodes = () => {
    if (!this.state.addNodesStatus) {
      return;
    }
    this.canvas.addNodes([
      {
        id: 'test8',
        name: 'test8',
        Class: node,
        color: '#c6e5ff'
      },
      {
        id: 'test9',
        name: 'test9',
        Class: node,
        color: '#c6e5ff'
      }
    ]);
    this.canvas.addEdges([
      {
        source: 'test4',
        target: 'test8',
      },
      {
        source: 'test4',
        target: 'test9',
      },
    ]);
    this.canvas.drageReDraw();
    this.setState({
      addNodesStatus: false
    });
  }

  // 删除节点
  removeNodes = () => {
    this.canvas.removeNodes(['test8', 'test9']);
    this.canvas.removeEdges([
      {
        source: 'test4',
        target: 'test8',
      },
      {
        source: 'test4',
        target: 'test9',
      },
    ]);
    this.canvas.drageReDraw();
    this.setState({
      addNodesStatus: true
    });
  }

  // 配置项改变
  optionsChange(key, value) {
    let oldOptions = this.canvas.layout.options;
    let newOptions = {...oldOptions, [key]: value};
    this.canvas.drageReDraw(newOptions);
  }

  render() {
    return (
      <div className='dagreLayout-page'>
        <div className='operate-bar'>
          <div className='operate-bar-title'>属性配置</div>
          <div className='operate-item'>
            <div className='operate-node'>增删节点:</div>
            <Button onClick = {this.addNodes}>添加节点</Button>
            <Button onClick = {this.removeNodes}>删除节点</Button>
          </div>
          <div className='operate-item'>
            <div className='operate-rankdir'>布局方向:</div>
            <Select defaultValue="TB" style={{width: 120}} onChange={this.optionsChange.bind(this, 'rankdir')}>
              <Option value="TB">TB</Option>
              <Option value="BT">BT</Option>
              <Option value="LR">LR</Option>
              <Option value="RL">RL</Option>
            </Select>
          </div>
          <div className='operate-item'>
            <div className='operate-align'>对齐方向:</div>
            <Select defaultValue='默认' style={{width: 120}} onChange={this.optionsChange.bind(this, 'align')}>
              <Option value={undefined}>默认</Option>
              <Option value="UL">UL</Option>
              <Option value="UR">UR</Option>
              <Option value="DL">DL</Option>
              <Option value="DR">DR</Option>
            </Select>
          </div>
          <div className='operate-item'>
            <div className='operate-nodesep'>水平间距:</div>
            <Slider defaultValue={40} onAfterChange = {this.optionsChange.bind(this, 'nodesep')} />
          </div>
          <div className='operate-item'>
            <div className='operate-ranksep'>层间距:</div>
            <Slider defaultValue={40} onAfterChange = {this.optionsChange.bind(this, 'ranksep')} />
          </div>
        </div>
        <div className="flow-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

ReactDOM.render(<DagreLayout />, document.getElementById('root'));
