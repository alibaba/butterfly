import React, {useContext, useEffect} from 'react';
import PropTypes from 'prop-types';

import Context from '../context';

function Endpoint(props) {
  // 其他属性参考：https://github.com/alibaba/butterfly/blob/dcd6a79ac6b939c2dacf16a8d160586035f10496/docs/zh-CN/endpoint.md#%E5%B1%9E%E6%80%A7
  const {id, nodeId, ...rest} = props;

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
    >
      {props.children}
    </span>
  );
}

Endpoint.propTypes = {
  id: PropTypes.string,
  nodeId: PropTypes.string,
  children: PropTypes.any
};

export default Endpoint;
