#!/bin/bash

set -e

APP_DIR=/usr/local/app

# 从环境变量中读取 HOST, 如果没有则使用 192.168.5.100
HOST=${HOST:-114.132.197.244}
PORT=${PORT:-7003}

echo "HOST：$HOST:$PORT"

rm -rf .next

# 安装依赖...
echo "开始安装依赖..."
npm install > /dev/null

# # 打包
# echo "开始打包..."
# npm run build > /dev/null

rm -rf zhuyu-admin-bunder.zip
zip -r zhuyu-admin-bunder.zip package.json package-lock.json next.config.js .env public tsconfig.json postcss.config.js global.d.ts
echo "文件大小：$(du -h zhuyu-admin-bunder.zip)"

echo "删除上上一个备份..."
ssh -p $PORT root@$HOST rm -rf $APP_DIR/zhuyu-admin-bunder-bak.zip 

# echo "备份上次打包文件..."
# ssh -p $PORT root@$HOST zip -r $APP_DIR/zhuyu-admin-bunder-bak.zip $APP_DIR/zhuyu-admin/package.json $APP_DIR/zhuyu-admin/package-lock.json $APP_DIR/zhuyu-admin/next.config.js $APP_DIR/zhuyu-admin/.env $APP_DIR/zhuyu-admin/.next $APP_DIR/zhuyu-admin/public

echo "上传文件..."
scp -P $PORT zhuyu-admin-bunder.zip root@$HOST:$APP_DIR/

echo "删除旧文件..."
ssh -p $PORT root@$HOST rm -rf $APP_DIR/zhuyu-admin

echo "解压文件..."
ssh -p $PORT root@$HOST unzip $APP_DIR/zhuyu-admin-bunder.zip -d $APP_DIR/zhuyu-admin/

echo "服务器上安装依赖..."
ssh -p $PORT root@$HOST "cd $APP_DIR/zhuyu-admin && pwd && npm ci"

echo "开始打包..."
ssh -p $PORT root@$HOST "cd $APP_DIR/zhuyu-admin && npm run build"

echo "重启服务..."
ssh -p $PORT root@$HOST "cd $APP_DIR/zhuyu-admin && pm2 start npm -- start"
