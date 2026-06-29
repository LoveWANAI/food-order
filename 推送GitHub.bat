@echo off
title 小爱专属服务 - 推送到GitHub
cd /d "%~dp0"
echo ================================================
echo  推送到 GitHub（用于永久部署）
echo ================================================
echo.

git add -A
git commit -m "更新H5网页版 - 支持GitHub Pages部署"
git push origin main

if errorlevel 1 (
    echo.
    echo 推送失败！请检查网络或Git配置
) else (
    echo.
    echo ================================================
    echo  推送成功！
    echo.
    echo  下一步：打开 GitHub 仓库
    echo  Settings - Pages - Source: GitHub Actions
    echo  部署完成后访问：
    echo  https://LoveWANAI.github.io/food-order
    echo ================================================
)
pause
