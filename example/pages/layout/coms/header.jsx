import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {Menu, Icon, Dropdown} from 'antd';
import {Link, withRouter} from 'react-router-dom';

import './index.less';

class Header extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    menu: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.menu = [
      {
        name: '首页',
        key: 'home'
      },
      {
        name: '示例',
        key: 'demo'
      },
      {
        name: '文档',
        key: 'doc',
        link: 'https://github.com/alibaba/butterfly/blob/master/README.md'
      },
      {
        icon: <Icon type="global" />,
        key: 'translate',
        action: 'translate',
        menu: (
          <Menu>
            <Menu.Item>
              中文
            </Menu.Item>
            <Menu.Item>
              English
            </Menu.Item>
          </Menu>
        )
      },
      {
        icon: <Icon type="github" />,
        key: 'github',
        link: 'https://github.com/alibaba/butterfly'
      }
    ];

    this.opacityArr = ['material', 'tool', 'practice', 'resources'];
  }

  getKey = () => {
    const pathname = this.props.location.pathname;

    const [, key] = pathname.split('/');

    return key;
  }


  render() {
    const key = this.getKey();


    return (
      <div
        className="home-header menu-light"
      >
        <div className="home-header-wrap" >
          <div className="home-lego-title" >Butterfly</div>
        </div>
        <div className="home-header-wrap right-menu" >
          <Menu
            selectedKeys={[key]}
            mode="horizontal"
            defaultSelectedKeys={['home']}
            {...this.props.menu}
          >
            {
              this.menu.map(item => {
                if (item.link) {
                  return (
                    <Menu.Item
                      key={item.key}
                      className={classnames({
                        icon: !!item.icon
                      })}
                    >
                      <a
                        rel="noopener noreferrer"
                        target="_blank"
                        href={item.link}
                      >
                        {
                          item.name || item.icon
                        }
                      </a>
                    </Menu.Item>
                  );
                }

                if (item.menu) {
                  return (
                    <Menu.Item
                      key={item.key}
                      className={classnames({
                        icon: !!item.icon
                      })}
                      onClick={() => this.onMenuClick(item.action)}
                    >
                      <Dropdown
                        overlay={item.menu}
                        placement="bottomRight"
                      >
                        {item.name || item.icon}
                      </Dropdown>
                      <div className="select-buttom" />
                    </Menu.Item>
                  );
                }

                return (
                  <Menu.Item
                    key={item.key}
                  >
                    <Link to={`/${item.key}`}>
                      {item.name}
                    </Link>
                    <div className="select-buttom" />
                  </Menu.Item>
                );
              })
            }
          </Menu>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  location: PropTypes.object
};

export default withRouter(Header);
