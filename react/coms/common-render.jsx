import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import ReactLabel from './react-label';
import ReactGroup from './react-group.jsx';
import checkRender from '../util/check-render.js';


// 公共渲染模块
const CommonRender = (props) => {
  const {
    data, type, renderKey,
    idPrefix
  } = props;

  if (!Array.isArray(data)) {
    return null;
  }

  return data.map(item => {
    const id = item.id;

    if (!id) {
      // eslint-disable-next-line
      console.warn(`${type} ${id} 不含有ID属性，请检查格式`);

      return null;
    }

    const dom = document.getElementById(idPrefix + item.id);

    if (!dom) {
      return null;
    }

    checkRender(item.render, type);

    const hasRender = !!item[renderKey];
    const ReactCom = type === 'group' ? ReactGroup : ReactLabel;

    return ReactDOM.createPortal(
      hasRender ? item[renderKey]() : <ReactCom key={id} {...item} />,
      dom
    );
  });
};

CommonRender.propTypes = {
  data: PropTypes.array,        // 需要渲染的数据
  type: PropTypes.string,       // 节点类型
  renderKey: PropTypes.string,  // 渲染函数key
  idPrefix: PropTypes.string    // id前缀
};

CommonRender.defaultProps = {
  renderKey: 'render'
};

export default CommonRender;

