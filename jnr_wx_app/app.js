// app.js
import {
  get_login
} from "./apis/api.js"
App({
  onLaunch(options) {

    // 禁用分享
    // wx.hideShareMenu({
    //   menus: ['index']
    // })
    // 场景值列表 https://developers.weixin.qq.com/miniprogram/dev/reference/scene-list.html
    this.globalData.scene = options.scene
    
    // let paramsObject = JSON.parse(decodeURIComponent(options.params));
    // 检测并获取小程序更新 api 说明：https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html
    // 基础库 1.9.90 开始支持，低版本需做兼容处理
    if (wx.canIUse('getUpdateManager')) { 
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (result) {
        if (result.hasUpdate) { // 有新版本
          updateManager.onUpdateReady(function () { // 新的版本已经下载好
            wx.showModal({
              title: '更新提示',
              content: '新版本已经下载好，请重启应用。',
              success: function (result) {
                if (result.confirm) { // 点击确定，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate();
                }
              }
            });
          });
          updateManager.onUpdateFailed(function () { // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            });
          });
        }
      });
    } else { // 有更新肯定要用户使用新版本，对不支持的低版本客户端提示
      wx.showModal({
        title: '温馨提示',
        content: '当前微信版本过低，无法使用该应用，请升级到最新微信版本后重试。'
      });
    }

    // 登录
    wx.login({
      success: function (res) {
        if (res.code) {
          // 发起网络请求
          get_login({
            code: res.code
          }).then(res => {
            // wx.setStorageSync('userInfo', {})
            // let _userInfo = wx.getStorageSync('userInfo');
            wx.setStorageSync('userInfo', {
              ...res.data.data,
              code: res.code
            });
            // 没openid 去登陆获取   如果是请求关联进来的，就不要跳到设置界面
            if (res.data.message == '添加成功' && options.path !== "pages/association/index") {
              //属于tabbar的页面，只能通过wx.switchTab来跳转
              wx.switchTab({
                url: '/pages/user/index',
              })
            }
          }).finally(() => {

          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },
  onLoad() {

  },
  globalData: {
    userInfo: null,
    // 场景值列表 https://developers.weixin.qq.com/miniprogram/dev/reference/scene-list.html
    scene: 0,
    // 服务器地址 主要用与 获取图片
    serverUrl: 'https://s1.z100.vip:7659'
    // serverUrl: 'https://jnr.backysu.cn'
  }
})