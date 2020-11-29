import React from 'react';
import {Tooltip} from 'antd';

const Label = () => {
  return (
    <Tooltip title="添加一个节点">
      <div className="label">
        +
      </div>
    </Tooltip>
  );
};

export default Label;