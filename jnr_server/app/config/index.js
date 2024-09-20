const config = require('../../config');
//获取本机ip
function getIpAddress() {
  const os = require('os');
  var interfaces = os.networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}
// const host = getIpAddress();
// const port = '3306';
// const password = '9595sjh...';

// dell
const host = config.database.host;
const port = config.database.port;
const password = config.database.password;

// 文件存储路径
const userConfig = {
  devUploadAvatarDir: config.fileStorage.devUploadAvatarDir, // 上传头像路径   开发环境
  alyProUploadAvatarDir: config.fileStorage.alyProUploadAvatarDir, // 上传头像路径  阿里云  生产环境
  wljProUploadAvatarDir: config.fileStorage.wljProUploadAvatarDir // 上传头像路径  物理机  生产环境
};

module.exports = {
  userConfig,
  mysql: {
    host,
    port,
    // 库名
    database: config.database.database,
    user: config.database.user,
    password,
    charset: 'utf8mb4', // 设置字符集为 utf8mb4
  }
};
