# white-dove-frontend
 博客系统 White Dove 的前端，采用 React.js 和 Ant.Design 编写.

 **后端在 [white-dove-backend](https://github.com/barkure/white-dove-backend)**.
# 前端部署方法
## 构建运行文件
### 使用 GitHub Actions 构建（推荐）
1. Fork本仓库，在你Fork的仓库点击`Actions`---`I understand my workflows, go ahead and enable them`（绿色Button）.
2. 点击仓库的 `Settings`---`secrets and variables`---`New repository`，在`Name*`填写`BACKEND`，在`Secret*`填写你的后端地址，比如：`https://api.blog.barku.re`.
3. 任意做一点修改后提交，触发Actions. 建议如此操作：在`README.md`中键入回车或者空格，然后保存.
4. 稍等两分钟，在`Release`中会有一个`release.zip`. 下载解压后即得到构建的`build`文件，然后照后文的**部署到服务器**操作.
5. （可选）如果你并不想让你的后端地址被他人知道，请及时删除`Realease`.

### 本地构建
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

3. 在项目的根目录，即`white-dove-frontend\`目录下，运行如下命令（分两次）：
```bash
npm install
npm run build
```
运行结束后，根目录会出现一个`build`文件夹，这是后面需要用到的.
注意：此处假设你的电脑已经安装了 [**Node.js**](https://nodejs.org/).

## 部署到服务器
上传你之前生成的 `build`文件夹下的所有文件（及目录）到你的站点根目录，**然后在 Nginx 的配置文件中添加以下设置：**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```
注：SSL 配置，域名绑定等请自行完成.
## 注意事项
默认账户：`admin` ，默认密码：`password`.

访问 “http(s)://前端地址/login” 可以正常看到登陆页面后，就说明前端部署完成.可以进行后端部署了.

**后端在 [white-dove-backend](https://github.com/barkure/white-dove-backend)**.