# 🦞 托福AI教练 - Docker部署

# 构建前端
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# 构建后端
FROM node:18-alpine AS backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ ./

# 最终镜像
FROM nginx:alpine

# 安装Node.js
RUN apk add --update nodejs npm

# 复制前端构建文件
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# 复制后端代码
COPY --from=backend /app/backend /app/backend

# 复制Nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 启动脚本
COPY docker-start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80 3000

CMD ["/start.sh"]
