# 使用官方的Node镜像，版本可以根据你的项目需要选择
FROM node:14-alpine

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json 到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 将项目文件复制到工作目录
COPY . .

# 构建生产环境的React应用
RUN npm run build

# 暴露容器的端口
EXPOSE 3000

# 定义启动命令
CMD ["npm", "start"]
