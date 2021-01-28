import React from 'react';
import PropTypes from 'prop-types';

function Endpoint(props) {
  const {id} = props;

  return (
    <span id={id}>
      {props.children}
    </span>
  );
}

Endpoint.propTypes = {
  id: PropTypes.string,
  children: PropTypes.element
};

export default Endpoint;
