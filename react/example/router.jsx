import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import 'antd/dist/antd.css';

import Basic from './pages/basic';
import Layout from './pages/layout';
import Endpoint from './pages/endpoints';

const RouterCfg = () => {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/basic">
            <Basic />
          </Route>
          <Route exact path="/endpoints">
            <Endpoint />
          </Route>
          <Route exact path="/">
            <Basic />
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
};

export default RouterCfg;
