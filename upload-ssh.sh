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
pnpm install

echo "检查 build 是否报错..."
pnpm build

rm -rf zhuyu-admin-bunder.zip build .next
zip -r zhuyu-admin-bunder.zip src prisma package.json package-lock.json next.config.js .env public tsconfig.json postcss.config.js global.d.ts
echo "文件大小：$(du -h zhuyu-admin-bunder.zip)"

echo "删除上上一个备份..."
ssh -p $PORT root@$HOST rm -rf $APP_DIR/zhuyu-admin-bunder-bak.zip 

# echo "备份上次打包文件..."
# ssh -p $PORT root@$HOST zip -r $APP_DIR/zhuyu-admin-bunder-bak.zip $APP_DIR/package.json $APP_DIR/src $APP_DIR/package-lock.json $APP_DIR/next.config.js $APP_DIR/.env $APP_DIR/public $APP_DIR/tsconfig.json $APP_DIR/postcss.config.js $APP_DIR/global.d.ts

echo "上传文件..."
scp -P $PORT zhuyu-admin-bunder.zip root@$HOST:$APP_DIR/

echo "删除旧文件..."
ssh -p $PORT root@$HOST rm -rf $APP_DIR/zhuyu-admin

echo "解压文件..."
ssh -p $PORT root@$HOST unzip $APP_DIR/zhuyu-admin-bunder.zip -d $APP_DIR/zhuyu-admin/

echo "服务器上安装依赖..."
ssh -p $PORT root@$HOST "cd $APP_DIR/zhuyu-admin && pwd && pnpm install"

echo "开始打包..."
ssh -p $PORT root@$HOST "cd $APP_DIR/zhuyu-admin && pnpm generate && pnpm build"

echo "重启服务..."
ssh -p $PORT root@$HOST "cd $APP_DIR/zhuyu-admin && pm2 start npm -- start"

echo "成功，清除打包文件"
rm -rf zhuyu-admin-bunder.zip build .next