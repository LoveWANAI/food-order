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
echo  构建成功！
echo.
echo  正在启动本地预览...
echo ================================================
echo.

npx serve dist -l 10086
pause
