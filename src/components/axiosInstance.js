// axiosInstance.js
import axios from 'axios';
import config from './config';

const instance = axios.create({
  baseURL: config.Backend_baseURL, // 设置后端API的基本URL
  timeout: 5000, // 设置请求超时时间
  headers: {
    'Content-Type': 'application/json', // 设置默认请求头
  },
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  // 给请求头添加 Authorization 字段
  return config;
}, function (error) {
  return Promise.reject(error);
});

export default instance;
