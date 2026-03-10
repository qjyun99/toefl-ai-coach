#!/bin/bash

# 🦞 托福AI教练部署脚本

echo "🦞 开始部署托福AI教练..."

# 检查环境
echo "📋 检查环境..."

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装"
    exit 1
fi

# 检查PM2
if ! command -v pm2 &> /dev/null; then
    echo "📦 安装 PM2..."
    npm install -g pm2
fi

# 部署后端
echo "🔧 部署后端..."
cd backend
npm install

# 创建环境变量文件（如果不存在）
if [ ! -f .env ]; then
    echo "📝 创建 .env 文件..."
    cat > .env << 'EOF'
PORT=3000
NODE_ENV=production
JWT_SECRET=toefl-ai-secret-key-change-in-production
# OPENAI_API_KEY=your-openai-api-key-here
EOF
fi

# 使用PM2启动后端
echo "🚀 启动后端服务..."
pm run build 2>/dev/null || true
pm2 delete toefl-ai-backend 2>/dev/null || true
pm2 start src/index.js --name toefl-ai-backend

cd ..

# 部署前端
echo "🎨 部署前端..."
cd frontend
npm install
npm run build

# 检查Nginx
if ! command -v nginx &> /dev/null; then
    echo "⚠️ Nginx 未安装，请手动安装并配置"
    echo "前端构建完成，文件在 dist/ 目录"
else
    # 复制到Nginx目录
    echo "📁 复制到Nginx目录..."
    sudo rm -rf /var/www/toefl-ai/*
    sudo cp -r dist/* /var/www/toefl-ai/
    
    # 创建Nginx配置
    echo "⚙️ 配置Nginx..."
    sudo tee /etc/nginx/sites-available/toefl-ai << 'EOF'
server {
    listen 80;
    server_name _;
    
    root /var/www/toefl-ai;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF
    
    # 启用站点
    sudo ln -sf /etc/nginx/sites-available/toefl-ai /etc/nginx/sites-enabled/
    sudo nginx -t && sudo systemctl reload nginx
fi

cd ..

# 保存PM2配置
echo "💾 保存PM2配置..."
pm2 save
pm2 startup

echo "✅ 部署完成！"
echo ""
echo "🌐 访问地址:"
echo "   前端: http://localhost"
echo "   后端API: http://localhost:3000"
echo ""
echo "📊 查看服务状态:"
echo "   pm2 status"
echo ""
echo "🦞 托福AI教练已上线！"
