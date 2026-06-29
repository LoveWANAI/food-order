// 内网穿透脚本 - 将本地服务暴露到公网
// 手机无需连同一个WiFi，随时随地都能访问
const localtunnel = require('localtunnel');

const PORT = 3001;  // 后端统一端口（含前端+API+WebSocket）

(async () => {
  console.log('================================================');
  console.log('  正在创建公网隧道...');
  console.log('================================================');
  console.log('');

  const tunnel = await localtunnel({ port: PORT });

  console.log('✅ 隧道已建立！');
  console.log('');
  console.log('📱 手机访问地址（复制到手机浏览器）：');
  console.log('   ' + tunnel.url);
  console.log('');
  console.log('💻 电脑访问地址：');
  console.log('   http://localhost:' + PORT);
  console.log('');
  console.log('================================================');
  console.log('  说明：');
  console.log('  - 手机登录：customer / 123456（顾客）');
  console.log('  - 电脑登录：merchant / 888888（商家）');
  console.log('  - 手机下单后，电脑会实时收到通知');
  console.log('================================================');
  console.log('');
  console.log('按 Ctrl+C 关闭隧道');
  console.log('');

  tunnel.on('close', () => {
    console.log('隧道已关闭');
  });

  tunnel.on('error', (err) => {
    console.error('隧道错误:', err);
  });
})();
