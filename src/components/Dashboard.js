// Dashboard组件，后台管理界面
import React, { useState, useEffect } from 'react'; // 引入React核心库
import { LogoutOutlined, FormOutlined, FileOutlined, PieChartOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
// 引入antd图标
import { Layout, Menu, theme, message } from 'antd'; // 引入antd组件
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom'; // 引入路由
import './style.css'; // 引入样式文件

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, path, children) {
  return {
    key,
    icon,
    path: `/dashboard${path}`,
    children,
    label,
  };
}

const items = [
  getItem('文章管理', '1', <PieChartOutlined />, '/article-management'),
  getItem('新建文章', '2', <EditOutlined />, '/new-article'),
  getItem('导入/导出', '3', <FileOutlined />, '/import-export'),
  getItem('账户设置', 'sub1', <UserOutlined />, '', [
    getItem('信息修改', '4', <FormOutlined />, '/account-settings'),
    getItem('退出登录', '5', <LogoutOutlined />, '/logout'),
  ]),
];


const Dashboard = () => {
  const [blogName, setBlogName] = useState(localStorage.getItem('blogName') || 'Default Blog Name');
  // 从 localStorage 中读取 blogName

  // 当 localStorage 中的 blogName 更新时，更新 blogName 的状态
  useEffect(() => {
    const handleStorageChange = () => {
      setBlogName(localStorage.getItem('blogName'));
    };

    window.addEventListener('storage', handleStorageChange);

    // 在组件卸载时移除事件监听器
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer } } = theme.useToken();
  const [selectedItem, setSelectedItem] = useState(items[0]);
  const location = useLocation();
  const navigate = useNavigate();

  // 检查localStorage中是否有token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // 如果没有token，重定向到登录页面
    }
  }, [navigate]);

  const handleMenuClick = e => {
    let clickedItem;
    for (let item of items) {
      if (item.key === e.key) {
        clickedItem = item;
        break;
      }
      if (item.children) {
        clickedItem = item.children.find(child => child.key === e.key);// 如果点击的是子菜单
        if (clickedItem) {// 如果点击的是子菜单
          break;
        }
      }
    }
    if (clickedItem) {
      if (clickedItem.key === '5') { // 如果点击的是 "退出登录"
        localStorage.removeItem('token'); // 删除 localStorage 中的 token
        localStorage.removeItem('userName'); // 删除 localStorage 中的 userName
        localStorage.removeItem('user_id'); // 删除 localStorage 中的 user_id
        localStorage.removeItem('GitHub_id'); // 删除 localStorage 中的 GitHub_id
        message.success('退出登录成功');
        navigate('/'); // 重定向至首页
      } else if (clickedItem.path) {
        navigate(clickedItem.path);
      }
    }
  };

  useEffect(() => {
    const currentPath = location.pathname;
    let currentItem;
    for (let item of items) {
      if (item.path === currentPath) {
        currentItem = item;
        break;
      }
      if (item.children) {
        currentItem = item.children.find(child => child.path === currentPath);
        if (currentItem) {
          break;
        }
      }
    }
    if (currentItem) {
      setSelectedItem(currentItem);
    }
  }, [location]);


  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className={`dashboard-logo-vertical ${collapsed ? 'dashboard-logo-vertical-small' : ''}`}>
          <h1>{blogName}</h1>
        </div>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={handleMenuClick}>
          {items.map(item => (
            item.children ? (
              <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
                {item.children.map(subItem => (
                  <Menu.Item key={subItem.key} icon={subItem.icon}>{subItem.label}</Menu.Item>
                ))}
              </Menu.SubMenu>
            ) : (
              <Menu.Item key={item.key} icon={item.icon}>{item.label}</Menu.Item>
            )
          ))}
        </Menu>
      </Sider>

      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <h2 className="dashboard-header">{selectedItem.label}</h2>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          <div className="right-footer">
            Powered by <Link to='https://github.com/barkure/white-dove-frontend'>白鸽</Link>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};
export default Dashboard;