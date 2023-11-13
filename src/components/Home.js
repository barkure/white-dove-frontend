// Home.js 博客首页
import React, { useContext, useState, useEffect } from 'react'; // 引入React核心库
import axiosInstance from './axiosInstance'; // 导入配置好的axios实例
import { List, Typography, Layout, Switch } from 'antd'; // 引入antd组件
import { Link } from 'react-router-dom'; // 引入路由
import './style.css'; // 引入样式文件
import NightModeContext from './NightModeContext'; // 引入夜间模式


const { Header, Footer, Content } = Layout;
const { Title } = Typography;


const LayoutStyle = {
    minHeight: '100vh',
    display: 'flex',
    backgroundColor: 'var(--background-color)',
};

const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: 'var(--text-color)',
    backgroundColor: 'var(--background-color)',
    margin: '0 auto',
    marginTop: '3%',
};


const themeStyle = {
    color: 'var(--text-color)',
    margin: 0, // 使博客名和主题切换按钮在同一行
};

const contentStyle = {
    textAlign: 'center',
    margin: '0 auto',
    marginTop: '2%',
    color: 'var(--text-color)',
    backgroundColor: 'var(--background-color)',
};

const footerStyle = {
    display: 'flex',
    alignItems: 'center',
    margin: '0 auto',
    justifyContent: 'space-between',
    color: 'var(--text-color)',
    backgroundColor: 'var(--background-color)',
};


// 博客首页
const Home = () => {
    const { isNightMode, toggleNightMode } = useContext(NightModeContext);
    const [data, setData] = useState([]);
    const [blogName, setBlogName] = useState(localStorage.getItem('blogName') || 'Default Blog Name');
    // 从 localStorage 中读取 blogName

    console.log(isNightMode); // 打印 isNightMode
    console.log(toggleNightMode); // 打印 toggleNightMode

    // 在组件加载时获取 blog_name
    useEffect(() => {
        axiosInstance.get('/static/get_blogName')
            .then(response => {
                localStorage.setItem('blogName', response.data.blogName);
                setBlogName(response.data.blogName);  // 更新 blogName 的状态
                document.title = `${response.data.blogName}`;
            })
            .catch(error => {
                console.error('Error fetching blogName:', error);
            });
    }, []);

    useEffect(() => {
        // 使用导入的axios实例进行数据请求
        axiosInstance.get('/articles/get_all_titles')
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <Layout className={`${isNightMode ? 'dark-mode' : 'light-mode'}`} style={LayoutStyle}>
            <Header className="header" style={headerStyle}>
                <Title level={3} style={themeStyle}>
                    <Link to="/">{blogName}</Link>
                </Title>
                <Switch checkedChildren="Light"
                    unCheckedChildren="Night"
                    defaultChecked onChange={toggleNightMode}
                    // 设置Switch的颜色
                    style={isNightMode ? { backgroundColor: 'gray', borderColor: 'white' } : null} />
            </Header>
            <Content className="content" style={contentStyle}>
                <List
                    size='large'
                    dataSource={data}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                title={<Link to={`/article/${item.article_id}`} className="title" style={themeStyle}>{item.title}</Link>}
                                description={
                                    <span style={{ color: isNightMode ? 'white' : 'black' }}>
                                        {item.update_date ? `更新于 ${item.update_date}` : `创建于 ${item.create_date}`}
                                    </span>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Content>
            <Footer className="footer" style={footerStyle}>
                <div className="left-footer">
                    &copy; {new Date().getFullYear()} <Link to="/">{blogName}</Link>.
                </div>
                <div className="right-footer">
                    Powered by <Link to='https://github.com/barkure/white-dove-frontend'>白鸽</Link>
                </div>
            </Footer>
        </Layout>
    );
};

export default Home;