import React, { useEffect } from 'react';
import axiosInstance from './axiosInstance'; // 导入配置好的axios实例
import { useLocation, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import config from './config';

const GitHubOAuthRedirect = () => {
    useEffect(() => {
        document.title = `${config.blogName} - GitHubOAuthRedirect`;
    }, []);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const storedCode = localStorage.getItem('code');
        const user_id = localStorage.getItem('user_id');
        const githubOauthOperation = localStorage.getItem('github_oauth_operation');
        // 获取 github_oauth_operation 的值，然后传给后端，用来区分是绑定还是登录

        if (code && code !== storedCode) {
            // 如果 code 存在且不等于 localStorage 中的 code
            localStorage.setItem('code', code); // 将 code 存储到 localStorage
            // 这里是个很玄学的问题，他会向后端请求两次，在第二次请求时 code 是失效的
            // 多次请求会导致： 登陆成功后大约2秒后会登陆失败
            // 所以这里使用 localStorage 来判断 code 是否用过，规避多次请求
            // 原因未知
            axiosInstance.post('/users/github_oauth', { code: code, operation: githubOauthOperation, user_id: user_id })
                .then(response => {
                    if (response.data.login_yes) {
                        localStorage.setItem('token', response.data.token);
                        localStorage.setItem('userName', response.data.userName);
                        localStorage.setItem('user_id', response.data.user_id);
                        localStorage.setItem('GitHub_id', response.data.GitHub_id);
                        localStorage.removeItem('github_oauth_operation'); // 移除 'operation'
                        localStorage.removeItem('code'); 
                        message.success('GitHub OAuth 登录成功');
                        navigate('/dashboard/article-management');
                    }
                    else if (response.data.bind_yes) {
                        message.success('成功与 GitHub 账户关联');
                        localStorage.setItem('GitHub_id', response.data.GitHub_id);
                        localStorage.removeItem('github_oauth_operation'); // 移除 'operation'
                        localStorage.removeItem('code'); 
                        navigate('/dashboard/account-settings');
                    }
                    else {
                        message.error('GitHub OAuth 失败，可能是未关联 GitHub 账户');
                        navigate('/login');
                        localStorage.removeItem('github_oauth_operation');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    message.error('GitHub OAuth 失败');
                    localStorage.removeItem('github_oauth_operation');
                });
        }
    }, [location.search, navigate]);

    return <div>Processing GitHub OAuth Callback URL...</div>;
};

export default GitHubOAuthRedirect;