import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {notification, Spin} from 'antd';

import './index.less';

const Sider = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const getList = async () => {
    setLoading(true);

    try {
      const result = await axios.get('/list.json');

      setList(result.data);
    } catch (e) {
      notification.error({
        title: '获取组件失败',
        message: e.message
      })
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getList();
  }, []);

  return (
    <div>
      <Spin spinning={loading}>
        {
          list.map(file => {
            return (
              <div>
                <Link to={`/demo/${file.name}`}>
                  {
                    file.name
                  }
                </Link>
              </div>
            )
          })
        }
      </Spin>
    </div>
  )
}

export default Sider;