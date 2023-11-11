# white-dove-frontend
 博客系统 White Dove 的前端，后端在 [white-dove-backend](https://github.com/barkure/white-dove-backend)
# White-Dove 部署方法
## docker-compose.yml 配置
 新建一个**docker-compose.yml**文件，内容如下：
 ```yml
version: '3'
services:
  white-dove-front:
    image: barkure/white-dove-frontend:latest
    ports:
      - "8080:3000"
    environment:
      - REACT_APP_BACKEND_BASE_URL=http://localhost:1234
      # 后端基本URL

  white-dove-backend:
    image: barkure/white-dove-backend:latest
    ports:
      - "1234:8000"
    environment:
      - GITHUB_CLIENT_ID=xxxxxxxxxxxxxxxxx
      # 将 GitHub 申请到的 GITHUB_CLIENT_ID 粘贴到这里
      - GITHUB_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxx
      # 将 GitHub 申请到的 GITHUB_CLIENT_SECRET 粘贴到这里
      - FRONTEND_URL=http://localhost:8080
      # 前端基本URL
      - SECRET_KEY=xdweji
      # 用来生成鉴权的令牌，可以键入随机字符串
      - ACCESS_TOKEN_EXPIRE_MINUTES=1440
      # 密钥有效期，此处是1440分钟，即一天
```

**GITHUB_CLIENT_ID**和**GITHUB_CLIENT_SECRET**需自己申请，指路如下： `GitHUb主页`--->`Settings`--->`Developer Settings`--->`GitHub Apps`--->`New GitHub App`，其他配置项可按需更改.
## 运行
在**docker-compose.yml**所在目录下，使用命令 `docker-compose up` 运行
## 其他
如果部署到服务器，您可能还要进行Nginx反向代理等操作.

