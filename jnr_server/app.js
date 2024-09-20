const express = require('express');
const os = require('os'); // 引入 os 模块
const app = express();
const port = 3928;

// 获取本地 IP 地址的函数
function getLocalIP() {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    const networkInterface = networkInterfaces[interfaceName];
    for (const iface of networkInterface) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1'; // 如果无法获取有效的 IP 地址，则返回默认值
}

// 使用 express.json() 中间件来解析 JSON 数据
app.use(express.json());
// 引入路由配置
const routes = require('./app/routes');
// 使用路由配置
app.use('/', routes); // 将路由配置挂载到 '/' 路径下

// 中间件
const interfaceAudit = require('./app/middlewares/interfaceAudit');
app.use(interfaceAudit);

// 引入定时任务逻辑
require('./app/tasks/scheduleTasks');

// 启动服务器，并在回调函数中获取服务器的 IP 地址并输出
app.listen(port, () => {
  const ipAddress = getLocalIP();
  const line = '---------------------------------------------------------------';
  console.log(`${line}\n
|    服务已启动                                                   |\n
|    地址：http://${ipAddress}:${port}                             |\n
|    启动时间：${new Date()}   |\n
${line}`
  );
});
