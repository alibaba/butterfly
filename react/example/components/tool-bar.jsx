import React from 'react';
import {Button} from 'antd';

import Whitespace from './white-space';

const Toolbar = () => {
  return (
    <div className="basic-tools">
    操作
      <Whitespace />
      <Button type="primary">
      添加节点
      </Button>
      <Whitespace />
      <Button>
      重新布局
      </Button>
    </div>
  );
};

export default Toolbar;
