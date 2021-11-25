import React from 'react';
import PropTypes from 'prop-types';

const ReactNode = (props) => {
  return (
    <div>{props.id}</div>
  );
};

ReactNode.propTypes = {
  id: PropTypes.string.isRequired
};

export default ReactNode;
