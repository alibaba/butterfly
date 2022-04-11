const adapterArray = (value) => {
  return Array.isArray(value) ? value : [value];
};

/**
 * 判断新旧的版本
 * @param {Array} news
 * @param {Array} olds
 * @param {String} key 对比用的key
 */
const diff = (news = [], olds = [], key = 'id') => {
  news = adapterArray(news);
  olds = adapterArray(olds);

  const created = [];
  const deleted = [];
  const updated = [];

  for (let item of news) {
    if (!olds.map(item => item[key]).includes(item[key])) {
      created.push(item);
    } else {
      updated.push(item);
    }
  }

  for (let item of olds) {
    if (!news.map(item => item[key]).includes(item[key])) {
      deleted.push(item);
    }
  }

  return {created, deleted, updated};
};

export default diff;