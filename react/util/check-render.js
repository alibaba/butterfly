/**
 * 校验render
 * @param {Function} render 渲染函数
 * @param {String} type 渲染类型
 */
const checkRender = (render, type) => {
  if (!type.render) {
    return null;
  }

  if (typeof render !== 'function') {
    throw Error(`${type}存在render属性，应该为function类型，现在是${typeof render}`);
  }
};

export default checkRender;
