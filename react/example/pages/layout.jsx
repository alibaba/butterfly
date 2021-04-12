import React from 'react';
import {Layout, Menu} from 'antd';
import PropTypes from 'prop-types';
import {DesktopOutlined, PieChartOutlined} from '@ant-design/icons';
import {Link, withRouter} from 'react-router-dom';

const {Header, Content, Sider} = Layout;

class SiderDemo extends React.Component {
  constructor(p) {
    super(p);

    this.state = {
      collapsed: false,
      title: '示例'
    };
  }

  onCollapse(collapsed) {
    this.setState({collapsed});
  }

  render() {
    const {collapsed, title} = this.state;
    const pathname = this.props.location.pathname;
    const active = pathname.replace(/^\//, '') || 'basic';

    return (
      <Layout style={{minHeight: '100vh'}}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={this.onCollapse.bind(this)}
        >
          <div className="logo">
            Butterfly-React
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[active]}
          >
            <Menu.Item key="basic" icon={<PieChartOutlined />}>
              <Link to="/basic">基础组件</Link>
            </Menu.Item>
            <Menu.Item key="endpoints" icon={<DesktopOutlined />}>
              <Link to="/endpoints">锚点组件</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header
            className="site-layout-background"
            style={{paddingLeft: 5}}
          >
            <h1>
              {
                title
              }
            </h1>
          </Header>
          <Content style={{margin: '0 16px'}}>
            {
              // eslint-disable-next-line
              this.props.children
            }
          </Content>
        </Layout>
      </Layout>
    );
  }
}

SiderDemo.propTypes = {
  location: PropTypes.object
};

export default withRouter(SiderDemo);

