import React from 'react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {Menu, Icon, Dropdown} from 'antd';
import {Link, withRouter} from 'react-router-dom';

import LOGO from '../../../static/logo.png';

import './index.less';

class Header extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    menu: PropTypes.object
  }

  onChangeLang = ({key}) => {
    i18next.changeLanguage(key);
    localStorage.i18nextLng = key;
    window.location.reload();
  }

  constructor(props) {
    super(props);
    this.menu = [
      {
        name: i18next.t('layout_header_home'),
        key: 'home'
      },
      {
        name: i18next.t('layout_header_demo'),
        key: 'demo'
      },
      {
        name: i18next.t('layout_header_doc'),
        key: 'doc',
        link: 'https://github.com/alibaba/butterfly/blob/master/README.md'
      },
      {
        icon: <Icon type="global" />,
        key: 'translate',
        action: 'translate',
        menu: (
          <Menu onClick={this.onChangeLang}>
            <Menu.Item key="zh">
              中文
            </Menu.Item>
            <Menu.Item key="en">
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
    const prefix = window.CONFIG.prefix;
    let pathname = this.props.location.pathname;
    // ${prefix}demo -> demo
    pathname = pathname.replace(prefix, '');

    const [key] = pathname.split('/');

    return key;
  }


  render() {
    const key = this.getKey();
    const prefix = window.CONFIG.prefix;

    return (
      <div
        className="home-header menu-light"
      >
        <div className="home-header-wrap" >
          <img className="logo" src={LOGO} title="data-design design for data" />
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
                    <Link to={`${prefix}${item.key}`}>
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
