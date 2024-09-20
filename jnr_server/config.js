// 服务配置信息
module.exports = {
  // 微信小程序  开发管理-开发设置-开发者ID
  wechat: {
    appid: '',
    secret: ''
  },
  // QQ邮箱
  qqEmail: {
    user_email: 'daycountdown@qq.com',
    // 邮箱密钥
    auth_code: ''
  },
  // 数据库
  database: {
    host: '192.168.1.110',
    port: '3306',
    user: 'root',
    password: '123456',
    database: 'jnr_database'
  },
  // 文件存储路径
  fileStorage: {
    // 本地路径
    devUploadAvatarDir: '/Users/sujunhao/Downloads/file',
    // 服务器路径
    alyProUploadAvatarDir: '/home/data/file/jnr/user_file',
    wljProUploadAvatarDir: '/home/data/file/jnr/user_file'
  }
};
