// pages/user/index.js
import {
  subscribeMessage,
  getSubscribeMessageAuthStatus,
  openSettingForSubscribeMessage
} from '../../utils/subscribeMessage';
import Notify from '@vant/weapp/notify/notify';
import Toast from '@vant/weapp/toast/toast';
import { set_info_user, update_subscription_count, verify_code_emall, verify_code, uploadFile, get_user }  from "../../apis/api" // 请求类型
import versionData from '../../static/data/version_data.js'
Page({
  data: {
    serverUrl: '',
    user_name: '',
    identifier: '',
    avatar_url: '',
    background_avatar_url: '',
    daysDifference: 0,
    wxInform: false,
    yxInform: false,
    shownMessage: false,
    shownAbout: false,
    email: '',
    code: '',
    codeDisable: false,
    codeTime: 60 * 1000,
    timeData: {},
    getCodeTixt: '获取验证码',
    saveDisabled: true,
    emailDisabled: false,
    shownSetAvatarName: false,
    gender: '0',
    saveLoading: false,
    // 是否被动修改用户信息 弹出的提示框
    passiveModification: true,
    subscription_remaining: 1,
    clickStatus: false,
    bootTipShow: false,
    version: versionData.version
  },

  // 更新日志
  updateLog() {
    wx.navigateTo({
      url: '/pages/updateLog/index'
    })
  },

  // 打开管理订阅弹窗
  onOpenMessage() {
    // 判断用户之前是否有拒绝过 权限
    getSubscribeMessageAuthStatus().then((status) => {
      if (status) {
        let _userInfo = wx.getStorageSync('userInfo');
        get_user({
          openid: _userInfo.openid
        }).then(res => {
            // 用户已授权
            this.setData({
              wxInform: true,
              subscription_remaining: res.data.data.subscription_remaining ? res.data.data.subscription_remaining : 0
            })
        })
      } else {
        this.setData({
          wxInform: false
        })
        // 用户拒绝了，得手动授权
        Toast({
          type: 'fail',
          message: '您拒绝订阅推送权限，请手动开启。',
          zIndex: 999999,
          position: 'bottom'
        });
      }
    })
    this.setData({
      shownMessage: true
    })
  },
  // 关闭管理订阅弹窗
  onCloseMessage() {
    this.setData({
      shownMessage: !this.data.shownMessage
    })
    let _userInfo = wx.getStorageSync('userInfo');
    let subscription_remaining = this.data.subscription_remaining ? this.data.subscription_remaining : 1
    // 保存用户手动点击的消息通知次数
    update_subscription_count({openid: _userInfo.openid, id: _userInfo.id, subscription_remaining}).then(res => {
      wx.setStorageSync('userInfo', {..._userInfo, subscription_remaining})
      // Toast('修改成功');
    }).finally(() => {
    })
    this.setData({
      yxInform: true,
      emailDisabled: true,
      code: ''
    })
  },

  // 打开 订阅消息 引导页面
  openBootTip() {
    this.setData({
      bootTipShow: true
    })
  },
  // 订阅通知 开关
  openMessage() {
    // 微信通知
    this.setData({
      wxInform: !this.data.wxInform,
      clickStatus: false
    })
    const tmplIds = ['vP1nBCcgYQWaIgyvRLEUssb-smzOi9RMTSV-xAmdnT0'];
    getSubscribeMessageAuthStatus(tmplIds).then(res => {
      if (res) {
        // 订阅成功
        let subscription_remaining = this.data.subscription_remaining
        this.setData({
          wxInform: true,
          subscription_remaining,
          clickStatus: false
        })
      } else {
        // 订阅失败或用户拒绝
      this.setData({
        wxInform: false,
      })
      Notify({
        type: 'warning',
        message: '你拒绝了消息推送，请手动设置订阅权限！',
        zIndex: 99999999,
        safeAreaInsetTop: true
      });
      }
    }).catch(error => {
      // 订阅失败或用户拒绝
      this.setData({
        wxInform: false,
      })
      Notify({
        type: 'warning',
        message: '你拒绝了消息推送，请手动开启！',
        zIndex: 99999999,
        safeAreaInsetTop: true
      });
    });
  },

  // 邮件通知 开关
  openMessageEmail() {
    this.setData({
      yxInform: !this.data.yxInform
    })
  },

  // 增加提示次数
  wechatSubscription() {
    const tmplIds = ['vP1nBCcgYQWaIgyvRLEUssb-smzOi9RMTSV-xAmdnT0'];
    this.setData({
      clickStatus: true
    })
    subscribeMessage(tmplIds).then(res => {
      Toast({
        type: 'success',
        message: '+1',
        zIndex: 99999999,
        position: 'middle'
      });
      // 订阅成功
      let subscription_remaining = this.data.subscription_remaining ? Number(this.data.subscription_remaining) + 1 : 1
      this.setData({
        wxInform: true,
        subscription_remaining,
        clickStatus: false
      })
    })
  },
  
  // 设置权限
  setPermission() {
    let _this = this
    wx.openSetting({
      success(res) {
        // console.log(res);
      }
    });
  },

  // 获取邮箱验证码
  getCode() {
    let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!this.data.email) {
      Toast({
        type: 'fail',
        message: '请填写邮箱',
        zIndex: 999999,
        position: 'bottom'
      });
      return
    } else if (emailPattern.test(this.data.email)) {
      let {id, openid, user_name} = wx.getStorageSync('userInfo')
      let email = this.data.email
      let subject = '邮箱验证码'
      verify_code_emall({id, openid, user_name, email, subject}).then(res => {
        Toast({
          type: 'success',
          message: '验证码已发送',
          zIndex: 999999,
          position: 'bottom'
        });
      }).finally(() => {
        this.setData({
          saveDisabled: false,
          code: ''
        })
        // 取消加载
        // Toast.clear();
      })
    } else {
      Toast({
        type: 'fail',
        message: '无效电子邮件',
        zIndex: 999999,
        position: 'bottom'
      });
      return
    }
    this.setData({
      codeDisable: true
    })
    setTimeout(() => {
      this.setData({
        codeDisable: false,
        getCodeTixt: '重新获取'
      })
    }, 60000)
  },

  // 提交验证码
  submitVerificationCode() {
    if (!this.data.code) {
      Toast({
        type: 'fail',
        message: '请填写验证码',
        zIndex: 999999,
        position: 'bottom'
      });
      return
    } else {
      let {id, openid} = wx.getStorageSync('userInfo')
      let {code, email} = this.data
      verify_code({id, openid, code, email}).then(res => {
        if (res.data.codeState) {
          Toast({
            type: 'success',
            message: '校验成功',
            zIndex: 999999,
            position: 'bottom'
          });
          this.setData({
            shownMessage: false,
            yxInform: true,
            emailDisabled: true,
            code: ''
          })

          // 获取已有的 userInfo 对象
          const existingUserInfo = wx.getStorageSync('userInfo') || {};
          // 修改特定属性
          existingUserInfo.email = email;
          // 将整个对象存回本地存储
          wx.setStorageSync('userInfo', existingUserInfo);
        } else {
          Toast({
            type: 'fail',
            message: '验证码错误',
            zIndex: 999999,
            position: 'bottom'
          });
        }
      }).finally(() => {
        // 取消加载
        // Toast.clear();
      })
    }
  },

  // 修改邮箱
  editEmail() {
    this.setData({
      shownMessage: true,
      yxInform: true,
      emailDisabled: false
    })
  },

  // 自定义倒计时样式
  onChange(e) {
    this.setData({
      timeData: e.detail,
    });
  },

  // 打开问题反馈
  onOpenIssue() {
    wx.openEmbeddedMiniProgram({
      // 腾讯兔小巢 授权appId
      appId: "wx8abaf00ee8c3202e",
      extraData :{
        // 把id数字换成你的产品ID，否则会跳到别的产品
        id : "608702",
        // 自定义参数，具体参考文档
        customData : {
            clientInfo: `iPhone OS 10.3.1 / 3.2.0.43 / 0`,
        }
      }
    })
  },

  // 关于
  onOpenAbout() {
    this.setData({
      shownAbout: true
    })
  },
  onCloseAbout() {
    this.setData({
      shownAbout: !this.data.shownAbout
    })
  },

  // 开源地址
  openCode() {
    wx.navigateTo({
      url: '/pages/codeAddress/index'
    })
  },

  // 获取头像
  bindchooseavatar(e) {
    let _userInfo = wx.getStorageSync('userInfo');
    // e.detail.avatarUrl 获取到的是本地临时链接，只能在本地中读取与使用，随时会失效。需要将这个临时路径的文件保存到服务器中
    uploadFile(e.detail.avatarUrl, 'file', '').then(res => {
      let url = res.data.url
      _userInfo.avatar_url = url
      wx.setStorageSync('userInfo', _userInfo);
      this.setData({
        avatar_url: url
      })
    }).finally(() => {
    })
  },

  // 设置名称
  setUserName(e) {
    this.setData({
      user_name: e.detail.value
    })
  },
  // 保存名称
  saveUserName(e) {
    if (!e.detail.value) return
    let _userInfo = wx.getStorageSync('userInfo');
    _userInfo.user_name = e.detail.value
    wx.setStorageSync('userInfo', _userInfo);
    // 发起网络请求
    // set_info_user({..._userInfo}).then(res => {
    //   Toast('修改成功');
    // }).finally(() => {
    // })
  },

  // 修改性别
  onChangeGender(e) {
    let _userInfo = wx.getStorageSync('userInfo');
    _userInfo.gender = e.detail
    wx.setStorageSync('userInfo', _userInfo);
    this.setData({
      gender: e.detail
    })
  },

  // 打开设置头像和名称 弹框
  editInof() {
    this.setData({
      passiveModification: false,
      shownSetAvatarName: true
    })
  },
  // 关闭设置头像和名称 弹框
  onCloseSetAvatarName() {
    this.setData({
      shownSetAvatarName: false
    })
  },

  // 保存用户信息
  saveInfo() {
    this.setData({
      saveLoading: true
    })
    let _userInfo = wx.getStorageSync('userInfo');
    _userInfo.gender = this.data.gender
    wx.setStorageSync('userInfo', _userInfo);
    set_info_user({..._userInfo}).then(res => {
      this.setData({
        saveLoading: false,
        shownSetAvatarName: false
      })
      Toast('修改成功');
    }).finally(() => {
      this.setData({
        saveLoading: false
      })
    })
  },

  onLoad() {
    const app = getApp();
    let serverUrl = app.globalData.serverUrl;
    this.setData({
      serverUrl
    })
    let _userInfo = wx.getStorageSync('userInfo');
    // 判断是否设置头像或名称
    if (!_userInfo.avatar_url || !_userInfo.user_name) {
      this.setData({
        passiveModification: true,
        shownSetAvatarName: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let _userInfo = wx.getStorageSync('userInfo');
    if (_userInfo.email) {
      this.setData({
        email: _userInfo.email,
        yxInform: true,
        emailDisabled: true
      })
    }

    // 计算账号创建天数
    // 获取两个时间戳之间的毫秒差值
    const timeDiff = Math.abs(new Date().getTime() - _userInfo.timestamp);
    const app = getApp();
    let serverUrl = app.globalData.serverUrl;
    this.setData({
      user_name: _userInfo.user_name,
      identifier: _userInfo.identifier,
      avatar_url: _userInfo.avatar_url,

      background_avatar_url: serverUrl + '/static' + _userInfo.avatar_url,
      
      gender: _userInfo.gender,
      // 将毫秒差值转换为天数，不足一天的部分也算一天
      daysDifference: Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
    })
    
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2 // 设置底部导航栏的选中状态
      });
    }

  },


  /**
   * 监听用户分享操作
   */
  // onShareAppMessage() {
  //   return {
  //     // title: '分享出去的卡片标题',
  //     // path: '/index/index?id=123',
  //     // 长宽比是 5:4
  //     // imageUrl: '/img/bg.jpg'
  // }
  // }
})
