# white-dove-frontend
 博客系统 White Dove 的前端，采用 React.js 和 Ant.Design 编写.

 **后端在 [white-dove-backend](https://github.com/barkure/white-dove-backend)**.
# 前端部署方法
## 修改前端配置
首先，你需要从GitHub上拉取这个仓库。你可以使用以下命令（亦或是下载本仓库）：

```bash
git clone https://github.com/barkure/white-dove-frontend.git
```
然后打开项目，修改相关的配置：
1. 打开 `src\components\config.js`，将第 5 行的`Backend_baseURL`修改为自己的后端地址，示例如下：
```javascript
const config = {
  Backend_baseURL: "https://api.blog.barku.re",
  // 修改为你的后端地址
};
```
2. 打开`public\index.html`，将第 21 行的`backend_url`修改为自己的后端地址，示例如下：
```javascript
var backend_url = "https://api.blog.barku.re";
```

## 构建前端运行文件
在项目的根目录，即`white-dove-frontend\`目录下，运行如下命令（分两次）：
```bash
npm install
npm run build
```
运行结束后，根目录会出现一个`build\`文件夹.
注意：此处假设你的电脑已经安装了 [**Node.js**](https://nodejs.org/).

## 部署到服务器
上传你之前生成的 `build`文件夹下的所有文件（及目录）到你的站点根目录，**然后在 Nginx 的配置文件中添加以下设置：**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```
___
注：SSL 配置，域名绑定等请自行完成.

访问 “http(s)://前端地址/login” 可以正常看到登陆页面后，就说明前端部署完成.可以进行后端部署了.

**后端在 [white-dove-backend](https://github.com/barkure/white-dove-backend)**.
默认账户：`admin` ，默认密码：`password`