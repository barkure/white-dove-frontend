// Login.js 登陆页面
import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosInstance'; // 导入配置好的axios实例
import { Layout, Button, Form, Input, message } from 'antd'; // 引入antd组件
import { UserOutlined, LockOutlined, GithubOutlined } from '@ant-design/icons'; // 引入antd图标
import { Link, useNavigate } from 'react-router-dom'; // 引入路由
import './style.css'; // 引入样式

const { Footer, Content } = Layout;

const LayoutStyle = {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
};

const contentStyle = {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    margin: '0 auto',
    marginTop: '25vh',
};

const footerStyle = {
    display: 'flex',
    alignItems: 'center',
    margin: '0 auto',
    justifyContent: 'space-between',
};


const Login = () => {
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

    useEffect(() => {
        document.title = `${blogName} - 登录`;
    }, []);

    const navigate = useNavigate(); // 获取路由导航对象
    const [GITHUB_OAUTH_URL, setGithubOauthUrl] = useState(null);

    useEffect(() => {
        axiosInstance.get('/users/github_oauth_url')
            .then(response => {
                setGithubOauthUrl(response.data.GITHUB_OAUTH_URL);
            })
            .catch(error => {
                console.error(error);
                // 处理错误
            });
    }, []);

    const onFinish = (values) => { // 登录表单提交
        console.log('Received values of form: ', values);
        axiosInstance.post('/users/login', {
            userNameOrEmail: values.userNameOrEmail,
            password: values.password,
        })
            .then(async response => {
                console.log(response);
                // 检查 login_yes 是否为 true
                if (response.data.login_yes) {
                    message.success('登陆成功');
                    // 将 token 和 userName 存储到 localStorage
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('userName', response.data.userName);
                    localStorage.setItem('user_id', response.data.user_id);
                    localStorage.setItem('GitHub_id', response.data.GitHub_id);
                    // 等待1秒, 等待 success message 显示完毕
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    // 登录成功，跳转到后台页面
                    navigate('/dashboard/article-management');
                } else {
                    // 如果 login_yes 为 false，显示错误消息
                    message.error('账户或密码错误');
                }
            })
            .catch(error => {
                console.error(error);
                // 处理错误
            });
    };

    return (
        <Layout style={LayoutStyle}>
            <Content style={contentStyle}>
                <div className="login-title">
                    <h1>{blogName} • 后台登陆</h1>
                </div>
                <Form name="normal_login" onFinish={onFinish}>
                    <Form.Item name="userNameOrEmail"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your userName or Email!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="userName or Email" />
                    </Form.Item>
                    <Form.Item name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                        ]}
                    >
                        <Input prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Continue
                        </Button>
                    </Form.Item>
                </Form>

                <Button onClick={() => {
                    if (GITHUB_OAUTH_URL) {
                        localStorage.setItem('github_oauth_operation', 'login');
                        window.location.href = GITHUB_OAUTH_URL;
                    }
                }} className="login-form-button" style={{ backgroundColor: 'black', color: 'white' }} icon={<GithubOutlined />}>
                    Continue with GitHub
                </Button>

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

export default Login;