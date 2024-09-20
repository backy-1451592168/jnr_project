const envConf = {
  //本地环境
  develop: {
    mode: 'dev',
    DEBUG: false,
    VCONSOLE: true,
    // 微信小程序  开发管理-开发设置-开发者ID
    appid: '',
    // 本地服务地址
    VUE_APP_BASE_URL: 'http://192.168.170.27:3928',
  },
  // 生产环境
  production: {
    mode: 'dev',
    DEBUG: false,
    VCONSOLE: true,
    // 微信小程序  开发管理-开发设置-开发者ID
    appid: '',
    // 戴尔服务器 后端服务地址
    VUE_APP_BASE_URL: '',
  }
}

module.exports = {
  env: envConf.develop
  // env: envConf.production
  // env: envConf[__wxConfig.envVersion] || envConf.production
}
