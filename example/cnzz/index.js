import * as defines from './consts';

const _czc = window._czc;
const key = '_trackEvent';

// ref：https://developer.umeng.com/docs/67963/detail/74512
export const log = (catagory, action, label, value, nodeId) => {
  if (!_czc || typeof _czc.push !== 'function') {
    return;
  }

  return _czc.push([key, catagory, action, label, value, nodeId]);
};

export const CATAGORY_TYPES = defines.CATAGORY_TYPES;
export const ACTION_TYPES = defines.ACTION_TYPES;
