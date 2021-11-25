import React from 'react';
import ReactDOM from 'react-dom';
import ReactButterfly from 'butterfly-react';

import data from './data.js';

import './index.less';
import 'antd/dist/antd.css';

const ReactSample = () => {
  return (
    <ReactButterfly
      {...data}
    />
  );
};

ReactDOM.render(<ReactSample />, document.getElementById('root'));
