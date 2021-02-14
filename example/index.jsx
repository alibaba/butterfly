import React from 'react';
import ReactDOM from 'react-dom';
import {createBrowserHistory} from 'history';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';

import dynamic from './lib/dynamic';

import Layout from './pages/layout';

import 'antd/dist/antd.css';
import './index.less';

const Home = dynamic(() => import('./pages/home'));
const Gallery = dynamic(() => import('./pages/gallery'));
const CodeBox = dynamic(() => import('./pages/code-box'));

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
