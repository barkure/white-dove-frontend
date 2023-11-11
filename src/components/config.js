// config.js

// 从环境变量中获取后端API的基本URL
const backendUrl = process.env.REACT_APP_BACKEND_BASE_URL;
// 如果要自己自己部署前后端，则应注释掉上面一行，然后取消下面一行的注释，并按需修改
// const backendUrl = http://localhost:8000;

// 从环境变量中获取后端API的基本URL
const config = {
  Backend_baseURL: backendUrl,
  // 后端API的基本URL
};

export default config;