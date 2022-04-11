import React, {useContext, useEffect} from 'react';
import PropTypes from 'prop-types';

import Context from '../context';

function Endpoint(props) {
  // 其他属性参考：https://github.com/alibaba/butterfly/blob/dcd6a79ac6b939c2dacf16a8d160586035f10496/docs/zh-CN/endpoint.md#%E5%B1%9E%E6%80%A7
  const {id, nodeId, className = '', ...rest} = props;

  const {gather} = useContext(Context);

  useEffect(() => {
    gather && gather({
      id,
      nodeId,
      ...rest
    });
  });

  return (
    <span
      id={id}
      className={className}
    >
      {props.children}
    </span>
  );
}

Endpoint.propTypes = {
  id: PropTypes.string,       // 锚点ID
  nodeId: PropTypes.string,   // 锚点所属节点ID
  children: PropTypes.any,    // 锚点下内容
  className: PropTypes.string // 锚点 className
};

export default Endpoint;
