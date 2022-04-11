import React from 'react';

import {data} from './mock-data';
import ButterflyReact from '../../../index';

import './basic.less';


const Basic = () => {
  return (
    <div className="basic-demo">
      <ButterflyReact {...data} />
    </div>
  );
};

export default Basic;
