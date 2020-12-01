import React from 'react';

import data from './data.jsx';
import ReactButterfly from '../../../../react';

import './index.less'

const ReactSample = () => {
  return (
    <ReactButterfly
      {...data}
    />
  )
}

export default ReactSample;
