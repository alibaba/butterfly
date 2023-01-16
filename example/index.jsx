'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom';
import {Layout, Menu} from 'antd';
import Emergency from './demo/emergency/index.jsx';
import Advanced from './demo/advanced/index.jsx';
import Diodes from './demo/diodes/index.jsx';
import Force from './demo/force/index.jsx';
import RelationalNetwork from './demo/relationalNetwork/index.jsx';
import RelationalBooks from './demo/relationalBooks/index.jsx';
import System from './demo/system/index.jsx';
import liteGraph from './demo/liteGraph/index.jsx';
import MindMap from './demo/mindMap/index.jsx';
import CompactBoxTree from './demo/compact-box-tree/index.jsx';
import EntityRelationship from './demo/entity-relationship/index.jsx';
import Emergency2 from './demo/emergency2/index.jsx';
import Industry from './demo/industry/index.jsx';
import Policy from './demo/policy/index.jsx';
import PluginPanel from './demo/pluginPanel/index.jsx';
import Flow from './demo/flow/index.jsx';
import Analysis from './demo/analysis/index.jsx';
import Schedule from './demo/schedule/index.jsx';
import Schedule2 from './demo/schedule2/index.jsx';
import Login from './demo/login/index.jsx';
import Decision from './demo/decision/index.jsx';
import RuleTree from './demo/rule-tree/index.jsx';
import IndentedTree from './demo/indented-tree/index.jsx';
import Circle from './demo/circle/index.jsx';
import Grid from './demo/grid/index.jsx';
import Fruchterman from './demo/fruchterman/index.jsx';
import ReactSample from './demo/react/sample/index.jsx';

import DagreLayout from './demo/dagreLayout/index.jsx';
import ConcentLayout from './demo/concent-layout/index.jsx';

import Radial from './demo/radial/index.jsx';

import 'antd/dist/antd.css';
import './static/iconfont.css';
import './static/newIconfont.css';
import './index.less';

const {Header, Content, Sider} = Layout;

ReactDOM.render((
  <Router>
    <Layout>
      <Header className='header'>小蝴蝶DEMO</Header>
      <Layout>
        <Sider>
          <Menu
            className='menu'
            mode='inline'
            theme="dark"
          >
            <Menu.Item key="advanced">
             <Link to="/advanced">Advanced</Link>
            </Menu.Item>
            <Menu.Item key="analysis">
              <Link to="/analysis">Analysis</Link>
            </Menu.Item>
            <Menu.Item key="circle">
              <Link to="/circle">Circle</Link>
            </Menu.Item>
            <Menu.Item key="compactBoxTree">
              <Link to="/compactBoxTree">Compact Box Tree</Link>
            </Menu.Item>
            <Menu.Item key="diodes">
              <Link to="/diodes">Diodes</Link>
            </Menu.Item>
            <Menu.Item key="dagre">
              <Link to="/dagreLayout">Dagre</Link>
            </Menu.Item>
            <Menu.Item key="decision">
              <Link to="/decision">Decision</Link>
            </Menu.Item>
            <Menu.Item key="entity-relationship">
              <Link to="/entity-relationship">Entity Relationship</Link>
            </Menu.Item>
            <Menu.Item key="emergency">
              <Link to="/emergency">Emergency</Link>
            </Menu.Item>
            <Menu.Item key="emergency2">
              <Link to="/emergency2">Emergency2</Link>
            </Menu.Item>
            <Menu.Item key="force">
              <Link to="/force">Force</Link>
            </Menu.Item>
            <Menu.Item key="flow">
              <Link to="/flow">Flow</Link>
            </Menu.Item>
            <Menu.Item key="Fruchterman">
              <Link to="/Fruchterman">Fruchterman</Link>
            </Menu.Item>
            <Menu.Item key="grid">
              <Link to="/grid">Grid</Link>
            </Menu.Item>
            <Menu.Item key="industry">
              <Link to="/industry">Industry</Link>
            </Menu.Item>
            <Menu.Item key="indented-tree">
              <Link to="/indented-tree">IndentedTree</Link>
            </Menu.Item>
            <Menu.Item key="liteGraph">
              <Link to="/lite_graph">LiteGraph</Link>
            </Menu.Item>
            <Menu.Item key="login">
              <Link to="/login">Login</Link>
            </Menu.Item>
            <Menu.Item key="mindMap">
              <Link to="/mind_map">MindMap</Link>
            </Menu.Item>
            <Menu.Item key="plugin-panel">
              <Link to="/plugin-panel">Plugin-panel</Link>
            </Menu.Item>
            <Menu.Item key="policy">
              <Link to="/policy">Policy</Link>
            </Menu.Item>
            <Menu.Item key="relationarBooks">
              <Link to="/relational_books">RelationalBooks</Link>
            </Menu.Item>
            <Menu.Item key="relationalNetwork">
              <Link to="/relational_network">Relational Network</Link>
            </Menu.Item>
            <Menu.Item key="rule-tree">
              <Link to="/rule-tree">RuleTree</Link>
            </Menu.Item>
            <Menu.Item key="schedule">
              <Link to="/schedule">Schedule</Link>
            </Menu.Item>
            <Menu.Item key="system">
              <Link to="/system">System</Link>
            </Menu.Item>
            <Menu.Item key="concent-layout">
              <Link to="/concent-layout">concent-layout</Link>
            </Menu.Item>
            <Menu.Item key="react-sample">
              <Link to="/react-sample">React-Sample</Link>
            </Menu.Item>
            <Menu.Item key="radial">
              <Link to="/radial">radial</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Content>
          <Route path="/advanced" component={Advanced} />
          <Route path="/emergency" component={Emergency} />
          <Route path="/diodes" component={Diodes} />
          <Route path="/force" component={Force} />
          <Route path="/relational_network" component={RelationalNetwork} />
          <Route path="/system" component={System} />
          <Route path="/lite_graph" component={liteGraph} />
          <Route path="/relational_books" component={RelationalBooks} />
          <Route path="/mind_map" component={MindMap} />
          <Route path="/dagreLayout" component={DagreLayout} />
          <Route path="/compactBoxTree" component={CompactBoxTree} />
          <Route path="/entity-relationship" component={EntityRelationship} />
          <Route path="/emergency2" component={Emergency2} />
          <Route path="/industry" component={Industry} />
          <Route path="/plugin-panel" component={PluginPanel} />
          <Route path="/policy" component={Policy} />
          <Route path="/flow" component={Flow} />
          <Route path="/analysis" component={Analysis} />
          <Route path="/schedule" component={Schedule} />
          <Route path="/schedule2" component={Schedule2} />
          <Route path="/decision" component={Decision} />
          <Route path="/login" component={Login} />
          <Route path="/rule-tree" component={RuleTree} />
          <Route path="/indented-tree" component={IndentedTree} />
          <Route path="/concent-layout" component={ConcentLayout} />
          <Route path="/circle" component={Circle} />
          <Route path="/grid" component={Grid} />
          <Route path="/Fruchterman" component={Fruchterman} />
          <Route path="/react-sample" component={ReactSample} />
          <Route path="/radial" component={Radial} />
          <Route exact path="/" component={() => <Redirect exact from="/" to="/analysis" />} />
        </Content>
      </Layout>
    </Layout>
  </Router>
), document.getElementById('main'));
