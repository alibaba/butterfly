'use strict';

const _ = require('lodash');

// 检验scope是否匹配
export default (scope1, scope2, isScopeStrict) => {
  let _scope1 = (scope1 || '').split(' ').filter(item => !!item);
  let _scope2 = (scope2 || '').split(' ').filter(item => !!item);
  if (!isScopeStrict && (!scope1 || !scope2)) {
    return true;
  } else if (isScopeStrict && !scope1 && !scope2) {
    return true;
  }
  let totalScope = _scope1.concat(_scope2);
  let uniqScope = _.uniq(totalScope);
  
  if (totalScope.length === uniqScope.length) {
    return false;
  } else {
    return true;
  }
};
