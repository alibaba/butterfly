import React from 'react';
import {Input} from 'antd';
import PropTypes from 'prop-types';

import './index.less';

const color = {
  black: 'linear-gradient(90deg,#324963 3%,#828fa5 93%)',
  orange: 'linear-gradient(90deg,#f69b31,#f7d44d 99%)'
};

const Node = (props) => {
  const {size} = props;

  return (
    <div className="node">
      <div
        className="header"
        style={{
          background: color[props.color]
        }}
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
