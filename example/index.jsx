import React from 'react';
import i18next from 'i18next';
import ReactDOM from 'react-dom';
import {createBrowserHistory} from 'history';
import LanguageDetector from 'i18next-browser-languagedetector';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';

import dynamic from './lib/dynamic';
import Layout from './pages/layout';
import zhCN from './i18n/zh_CN.json';
import enUS from './i18n/en_US.json';

import './index.less';
import 'antd/dist/antd.css';
const Home = dynamic(() => import('./pages/home'));
const Gallery = dynamic(() => import('./pages/gallery'));
const CodeBox = dynamic(() => import('./pages/code-box'));

window.CONFIG = {
  // eslint-disable-next-line no-undef
  prefix: PREFIX
};

const prefix = window.CONFIG.prefix;

const main = async () => {
  try {
    await i18next.use(LanguageDetector).init({
      debug: true,
      resources: {
        en: {
          translation: enUS
        },
        zh: {
          translation: zhCN
        }
      }
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('i18n init failed', e.stack);
  }

  ReactDOM.render((
    <Router history={createBrowserHistory()}>
      <Layout>
        <Switch>
          <Route exact path={`${prefix}home`} component={Home} />
          <Route exact path={`${prefix}demo/:demo`} component={CodeBox} />
          <Route exact path={`${prefix}demo`} component={Gallery} />
          <Redirect from="/" to={`${prefix}home`} />
        </Switch>
      </Layout>
    </Router>
  ), document.getElementById('main'));
};

main();
