'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import { Layout, Menu } from 'antd';
const { Header, Content, Sider } = Layout;

import Emergency from './demo/emergency/index.jsx';
import Diodes from './demo/diodes/index.jsx';
import Force from './demo/force/index.jsx';
import RelationalNetwork from './demo/relationalNetwork/index.jsx';
import RelationalBooks from './demo/relationalBooks/index.jsx';
import System from './demo/system/index.jsx';
import liteGraph from './demo/liteGraph/index.jsx';
import EntityRelationship from './demo/entityRelationship/index.jsx';
import MindMap from './demo/mindMap/index.jsx';
import CompactBoxTreeNew from './demo/compactBoxTree-new/index.jsx';
import EntityRelationshipNew from './demo/entityRelationship-new/index.jsx';
import EmergencyNew from './demo/emergency-new/index.jsx';
import IndustryNew from './demo/industry-new/index.jsx';
import PolicyNew from './demo/policy-new/index.jsx';
import FlowNew from './demo/flow-new/index.jsx';
import AnalysisNew from './demo/analysis-new/index.jsx';
import Schedule from './demo/schedule/index.jsx';
import Schedule2 from './demo/schedule2/index.jsx';
import LoginNew from './demo/login-new/index.jsx';
import DecisionNew from './demo/decision-new/index.jsx';
import DrageLayout from './demo/DrageLayout/index.jsx';

import 'antd/dist/antd.css';
import './static/iconfont.css';
import './index.less';

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
            <Menu.Item key="emergency">
              <Link to="/emergency">Emergency</Link>
            </Menu.Item>
            <Menu.Item key="diodes">
              <Link to="/diodes">Diodes</Link>
            </Menu.Item>
            <Menu.Item key="force">
              <Link to="/force">Force</Link>
            </Menu.Item>
            <Menu.Item key="relationalNetwork">
              <Link to="/relational_network">Relational Network</Link>
            </Menu.Item>
            <Menu.Item key="system">
              <Link to="/system">System</Link>
            </Menu.Item>
            <Menu.Item key="liteGraph">
              <Link to="/lite_graph">LiteGraph</Link>
            </Menu.Item>
            <Menu.Item key="entity">
              <Link to="/entity">Entity Relationship</Link>
            </Menu.Item>
            <Menu.Item key="relationarBooks">
              <Link to="/relational_books">RelationalBooks</Link>
            </Menu.Item>
            <Menu.Item key="mindMap">
              <Link to="/mind_map">MindMap</Link>
            </Menu.Item>
            <Menu.Item key="drage">
              <Link to="/drageLayout">Drage</Link>
            </Menu.Item>
            <Menu.Item key="compactBoxTree-new">
              <Link to="/compactBoxTree-new">CompactBoxTree-new</Link>
            </Menu.Item>
            <Menu.Item key="entityRelationship-new">
              <Link to="/entityRelationship-new">EntityRelationship-new</Link>
            </Menu.Item>
            <Menu.Item key="emergency-new">
              <Link to="/emergency-new">Emergency-new</Link>
            </Menu.Item>
            <Menu.Item key="industry-new">
              <Link to="/industry-new">Industry-new</Link>
            </Menu.Item>
            <Menu.Item key="policy-new">
              <Link to="/policy-new">Policy-new</Link>
            </Menu.Item>
            <Menu.Item key="flow-new">
              <Link to="/flow-new">Flow-new</Link>
            </Menu.Item>
            <Menu.Item key="analysis-new">
              <Link to="/analysis-new">Analysis-new</Link>
            </Menu.Item>
            <Menu.Item key="schedule">
              <Link to="/schedule">Schedule</Link>
            </Menu.Item>
            <Menu.Item key="schedule2">
              <Link to="/schedule2">Schedule2</Link>
            </Menu.Item>
            <Menu.Item key="decision-new">
              <Link to="/decision-new">Decision-new</Link>
            </Menu.Item>
            <Menu.Item key="login-new">
              <Link to="/login-new">Login-new</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Content>
          <Redirect from="/" to="/login-new" />
          <Route path="/emergency" component={Emergency} />
          <Route path="/diodes" component={Diodes} />
          <Route path="/force" component={Force} />
          <Route path="/relational_network" component={RelationalNetwork} />
          <Route path="/system" component={System} />
          <Route path="/lite_graph" component={liteGraph} />
          <Route path="/entity" component={EntityRelationship} />
          <Route path="/relational_books" component={RelationalBooks} />
          <Route path="/mind_map" component={MindMap} />
          <Route path="/drageLayout" component={DrageLayout} />
          <Route path="/compactBoxTree-new" component={CompactBoxTreeNew} />
          <Route path="/entityRelationship-new" component={EntityRelationshipNew} />
          <Route path="/emergency-new" component={EmergencyNew} />
          <Route path="/industry-new" component={IndustryNew} />
          <Route path="/policy-new" component={PolicyNew} />
          <Route path="/flow-new" component={FlowNew} />
          <Route path="/analysis-new" component={AnalysisNew} />
          <Route path="/schedule" component={Schedule} />
          <Route path="/schedule2" component={Schedule2} />
          <Route path="/decision-new" component={DecisionNew} />
          <Route path="/login-new" component={LoginNew} />
        </Content>
      </Layout>
    </Layout>
  </Router>
), document.getElementById('main'));