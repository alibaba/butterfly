import PropTypes from 'prop-types';

export default {
  nodes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      render: PropTypes.func,           // 渲染函数
      left: PropTypes.number,
      top: PropTypes.number,
      draggable: PropTypes.bool
    })
  ),
  edges: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      labelRender: PropTypes.func,      // label渲染函数
      className: PropTypes.string       // 线条的className
    })
  ),
  groups: PropTypes.array,              // 组的数据
  options: PropTypes.shape({            // 画布属性
    layout: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
      PropTypes.object
    ]),
    zoomable: PropTypes.bool,
    moveable: PropTypes.bool,
    draggable: PropTypes.bool,
    linkable: PropTypes.bool,
    disLinkable: PropTypes.bool,
    theme: PropTypes.object,
    global: PropTypes.object
  }),
  onEdgesChange: PropTypes.func,
  onCreateEdge: PropTypes.func,
  onDeleteEdge: PropTypes.func,
  className: PropTypes.string,
  onLoaded: PropTypes.func,
  onEachFrame: PropTypes.func         // 每一次数据绘画完之后
};
