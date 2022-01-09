import React, {useState} from 'react';
import _ from 'lodash';

import {data} from './mock-data';
import ButterflyReact from '../../../index';

import './basic.less';


const Basic = () => {
  const [butterflyData, setButterflyData] = useState(data);

  const click = () => {
    let data = _.cloneDeep(butterflyData);
    data.nodes[0].isHighlight1 = !data.nodes[0].isHighlight1;
    setButterflyData(data);
  };
  return (
    <div className="basic-demo">
      <button onClick={click}>高亮</button>
      <ButterflyReact {...butterflyData} />
    </div>
  );
};

export default Basic;
