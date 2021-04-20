import React from 'react';
import PropTypes from 'prop-types';
import {Button, Select} from 'antd';

import Whitespace from './white-space';

const Option = Select.Option;
const noop = () => null;

const Toolbar = (props) => {
  const {
    onAddEdge = noop,
    onAddNode = noop,
    onSwitchData = noop,
    onSwitchColor = noop
  } = props;

  return (
    <div className="basic-tools">
    操作
      <Whitespace />
      <Button
        type="primary"
        onClick={onAddNode}
      >
        添加节点
      </Button>
      <Whitespace />
      <Button>
        重新布局
      </Button>
      <Whitespace />
      <Button onClick={onSwitchData}>
        切换数据
      </Button>
      <Whitespace />
      <Button onClick={onAddEdge}>
        添加边
      </Button>
      <Whitespace />
      边颜色：
      <Select
        style={{width: 120}}
        onSelect={onSwitchColor}
      >
        {
          ['red', 'blue', 'yellow', 'black'].map((color) => {
            return (
              <Option value={color} key={color} />
            );
          })
        }
      </Select>
    </div>
  );
};

Toolbar.propTypes = {
  onAddNode: PropTypes.func,
  onAddEdge: PropTypes.func,
  onSwitchData: PropTypes.func,
  onSwitchColor: PropTypes.func,
};

export default Toolbar;
