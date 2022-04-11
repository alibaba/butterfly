import React, {useState} from 'react';
import PropTypes from 'prop-types';

import './node.less';

const Node = (props) => {
  const [isHighlight, setIsHighlight] = useState(false);
  return (
    <div className="bf-node" onClick={() => {
      setIsHighlight(!isHighlight);
    }}>
      <div className="bf-title">
        {props.title}
      </div>
      {
        props.children
      }
      {
        isHighlight && '我是高亮的'
      }
      {
        props.item && props.item.isHighlight1 && '我是高亮的1'
      }
    </div>
  );
};

Node.propTypes = {
  title: PropTypes.string,
  children: PropTypes.any,
  item: PropTypes.object
};

export default Node;
