import React from 'react';
import ReactDOM from 'react-dom';
import data from './data.js';
import ReactButterfly from 'butterfly-react';

import './index.less';

const ReactSample = () => {
  return (
    <ReactButterfly
      {...data}
    />
  );
};

ReactDOM.render(<ReactSample />, document.getElementById('root'));
