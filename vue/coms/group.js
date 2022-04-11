import {Group} from 'butterfly-dag';

const getGroupStyle = (left, top) => {
  return {
    left: left + 'px',
    top: top + 'px',
    position: 'absolute'
  };
};

class DefaultGroup extends Group {
  draw(group) {
    const div = document.createElement('div');

    const style = getGroupStyle(group.left, group.top);
    Object.keys(style).forEach(key => {
      div.style[key] = style[key];
    });

    div.className = 'butterfly-group';

    div.id = `bf_group_${group.id}`;
    div.className = 'butterflies-group';

    return div;
  }
}

export default DefaultGroup;