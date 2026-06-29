@echo off
title Food Order 点餐系统
cd /d "%~dp0"

echo ================================================
echo         Food Order 点餐系统
echo ================================================
echo.
echo [1/3] 构建前端...
call npm.cmd run build:h5
if %errorlevel% neq 0 (
    echo 构建失败！
    pause
    exit /b 1
)

echo.
echo [2/3] 启动服务器...
start "FoodOrder-Server" cmd /c "title FoodOrder-Server && node server\server.js"
timeout /t 3 /nobreak >nul

echo [3/3] 创建公网隧道...
echo ================================================
echo    复制下面地址到手机浏览器即可访问！
echo ================================================
echo.

node server\tunnel.js

echo.
pause
