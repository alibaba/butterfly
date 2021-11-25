import React from 'react';
import ReactDOM from 'react-dom';

import Test from './butterfly-test/index.jsx';

import './index.less'

const root = (
  <div>
    <div>小蝴蝶Plugins-panel-demo</div>
    <Test />
  </div>
);

ReactDOM.render((
  root
), document.getElementById('main'));