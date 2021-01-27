import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import 'antd/dist/antd.css';

import Basic from './pages/basic';
import Layout from './pages/layout';

const RouterCfg = () => {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route path="/">
            <Basic />
          </Route>
          <Route path="/basic">
            <Basic />
          </Route>
          <Route path="/endpoints">
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
};

export default RouterCfg;
