#!/bin/sh

# 🦞 启动托福AI教练

echo "🦞 启动托福AI教练..."

# 启动后端
cd /app/backend
echo "🔧 启动后端服务..."
node src/index.js &

# 等待后端启动
sleep 3

# 启动Nginx
echo "🌐 启动Nginx..."
nginx -g 'daemon off;'
