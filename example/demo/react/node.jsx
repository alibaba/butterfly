import React from 'react';
import {Input} from 'antd';
import PropTypes from 'prop-types';

import './index.less';

const Node = (props) => {
  const {size} = props;

  return (
    <div className="node">
      <div
        className="header"
      >
        {props.title}
      </div>
      {
        size !== 'small' && (
          <div className="content">
            <div className="info">
              <Input
                size="small"
                placeholder="申请人姓名"
              />
            </div>
            <div className="history">
            修改: 10 阅读: 20
            </div>
          </div>
        )
      }
    </div>
  );
};

Node.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
};

Node.defaultProps = {
  color: 'black'
};

export default Node;
