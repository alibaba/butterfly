import React from 'react';
import ReactDOM from 'react-dom';

import './index.less';
import 'react-dev-utils/webpackHotDevClient';
import Router from './router';

ReactDOM.render(
  <Router />,
  document.getElementById('root')
);

