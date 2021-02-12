import React from 'react';
import {createBrowserHistory} from 'history';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Layout from './pages/layout';
import Gallery from './pages/gallery';
import CodeBox from './pages/code-box';

import 'antd/dist/antd.css'

ReactDOM.render((
  <Router history={createBrowserHistory()}>
    <Layout>
      <Switch>
        <Route exact path="/demo/:demo" component={CodeBox} />
        <Route exact path="/" component={Gallery} />
      </Switch>
    </Layout>
  </Router>
), document.getElementById('main'));
