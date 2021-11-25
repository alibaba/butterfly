/**
 * css object to css, 暂时只支持 css 转换，其他例如 less、sass不支持
 * @param {Object} cssStylesheet ref: https://developer.mozilla.org/zh-CN/docs/Web/API/CSSStyleSheet
 */
export default (cssStylesheet) => {
  if (!cssStylesheet) {
    return '';
  }

  return Array.from(cssStylesheet.cssRules).map(rule => {
    return rule.cssText;
  }).join('\n');
};
