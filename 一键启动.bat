@echo off
title 小爱专属服务 - 一键启动
cd /d "%~dp0"
echo ================================================
echo           小爱专属服务
echo ================================================
echo.

REM 检查 node_modules
if not exist "node_modules\" (
    echo [提示] 首次运行，正在安装依赖...
    echo.
    call npm install
    echo.
)

echo 正在构建，请稍候...
echo.
call npm run build:h5

if errorlevel 1 (
    echo.
    echo ================================================
    echo  构建失败！请检查上方错误信息
    echo ================================================
    pause
    exit /b 1
)

echo.
echo ================================================
echo  构建成功！正在创建公网隧道...
echo  稍后会出现一个网址，复制到手机浏览器即可
echo ================================================
echo.

REM 启动 Node.js 静态文件服务器
start /B node -e "const http=require('http'),fs=require('fs'),path=require('path');const base='.\dist';const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.json':'application/json'};http.createServer((req,res)=>{let file=path.join(base,req.url.split('?')[0]);if(file.endsWith('/'))file=path.join(file,'index.html');fs.readFile(file,(err,data)=>{if(err){res.writeHead(200,{'Content-Type':'text/html'});fs.readFile(path.join(base,'index.html'),(_,d)=>res.end(d));}else{let ext=path.extname(file);res.writeHead(200,{'Content-Type':types[ext]||'application/octet-stream'});res.end(data);}})}).listen(10086,()=>console.log('Server running'))"

timeout /t 3 /nobreak >nul

REM 创建公网隧道
npx localtunnel --port 10086

pause
