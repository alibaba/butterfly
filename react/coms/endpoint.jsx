import React, {useContext, useEffect} from 'react';
import PropTypes from 'prop-types';

import Context from '../context';

function Endpoint(props) {
  const {id, nodeId} = props;

  const {gather} = useContext(Context);

  useEffect(() => {
    gather && gather({
      id,
      nodeId
    })
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
  children: PropTypes.element
};

export default Endpoint;
