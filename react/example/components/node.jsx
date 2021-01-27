import React from 'react';
import PropTypes from 'prop-types';

import './node.less';

const Node = (props) => {
  return (
    <div className="bf-node">
      <div className="bf-title">
        {props.title}
      </div>
    </div>
  );
};

Node.propTypes = {
  title: PropTypes.string
};

export default Node;
