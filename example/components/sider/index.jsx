import React, {useState, useEffect} from 'react';
import i18next from 'i18next';
import axios from 'axios';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {Link, withRouter} from 'react-router-dom';
import {Tooltip, notification, Spin, Icon} from 'antd';

import * as cnzz from '../../cnzz';

import './index.less';

const prefix = window.CONFIG.prefix;

const tips = (file) => {
  const lng = i18next.language;
  const isZh = lng !== 'en';

  return (
    <div>
      {
        isZh ? file.cn_name : file.name
      }
      <br />
      {
        isZh ? file.cn_description : file.description
      }
    </div>
  );
};

const noop = () => null;

const Sider = (props) => {
  const [isFold, setIsFold] = useState(false);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const {onFold = noop} = props;

  // eslint-disable-next-line
  const active = props?.match?.params?.demo;

  const getList = async () => {
    setLoading(true);

    try {
      const result = await axios.get('/list.json');

      setList(result.data);
    } catch (e) {
      notification.error({
        title: '获取组件失败',
        message: e.message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div
      className={classnames('sider', {fold: isFold})}
    >
      <Spin spinning={loading}>
        {
          list.map(file => {
            return (
              <div
                className={classnames('demo-cover', {active: active === file.dir})}
                key={file.dir}
              >
                <Tooltip
                  title={tips(file)}
                  placement="right"
                >
                  <Link
                    to={`${prefix}demo/${file.dir}`}
                    onClick={() => cnzz.log(
                      cnzz.CATAGORY_TYPES.DEMO,
                      cnzz.ACTION_TYPES.VIEW_DEMO,
                      file.dir,
                      file.dir
                    )}
                  >
                    <img src={file.cover} />
                  </Link>
                </Tooltip>
              </div>
            );
          })
        }
      </Spin>
      <div
        className={classnames('folder-op', {active: isFold})}
        onClick={() => {
          setIsFold(!isFold);
          onFold(!isFold);
        }}
      >
        <Icon type={isFold ? 'right' : 'left'} />
      </div>
    </div>
  );
};

Sider.propTypes = {
  type: PropTypes.oneOfType(['small', 'middle']),
  match: PropTypes.shape({
    params: PropTypes.shape({
      demo: PropTypes.string
    })
  }),
  onFold: PropTypes.func,         // 展开-收起
};

export default withRouter(Sider);
