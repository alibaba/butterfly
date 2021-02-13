import React from 'react';
import ReactDOM from 'react-dom';
import {createBrowserHistory} from 'history';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';

import Home from './pages/home';
import Layout from './pages/layout';
import Gallery from './pages/gallery';
import CodeBox from './pages/code-box';

import 'antd/dist/antd.css';
import './index.less';

ReactDOM.render((
  <Router history={createBrowserHistory()}>
    <Layout>
      <Switch>
        <Route exact path="/home" component={Home} />
        <Route exact path="/demo/:demo" component={CodeBox} />
        <Route exact path="/demo" component={Gallery} />
        <Redirect from="/" to="/home" />
      </Switch>
    </Layout>
  </Router>
), document.getElementById('main'));
