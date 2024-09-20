// pages/home/home.js
import { get_anniversary_list, get_login }  from "../../apis/api" // 请求类型
import { calculateMonthlyData, calculateDataEachYear, calculateCumulativeData, hexToRgb } from '../../utils/common'
Page({
  data: {
    // 展示数据
    cardList: [],
    // 原始数据
    rawDataList: [],
    // 置顶数据
    topDataList: [],
    bg_type: 0,
    love_type: 0,
    show: false,
    serverUrl: ''
  },
  onShow: function () {
    let _userInfo = wx.getStorageSync('userInfo');
    this.setData({
      bg_type: _userInfo.bg_type == 1 ? 1 : 0,
      love_type: _userInfo.love_type == 1 ? 1 : 0
    })
    this.getList()
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0 // 设置底部导航栏的选中状态
      });
    }
  },

  // 在微信小程序中可以在这里执行页面加载时的操作
  onLoad() {
    // this.getList()
    const app = getApp();
    
    // 1010	收藏夹、1103	发现页小程序「我的小程序」列表、1104	微信聊天主界面下拉，「我的小程序」栏 1257	pc端小程序面板「我的小程序」列表
    let {scene, serverUrl} = app.globalData;
    this.setData({
      serverUrl
    })
    if (scene !== 1010 && scene !== 1103 && scene !== 1104 && scene !== 1257) {
      this.setData({
        show: true
      })
    }
  },

  // 获取列表
  async getList() {
    // Toast.loading({
    //   duration: 0, // 持续展示 toast
    //   message: '加载中...',
    //   forbidClick: true,
    // });
    let _userInfo = wx.getStorageSync('userInfo');
    if (!_userInfo.id && !_userInfo.openid) {
      let data = await this.getUserInfo()
      this.getDataList(data.id, data.openid)
    } else {
      this.getDataList(_userInfo.id, _userInfo.openid)
    }
  },
  getDataList(id, openid) {
    get_anniversary_list({id, openid}).then(res => {
      let data = res.data.data.map((item)=> {
        let rgbColor = hexToRgb(item.preset_color)
        if (item.date_type == 0) {
          let {days, dayInWeek} = calculateCumulativeData(item.date)
          let [yyyy, mm, dd] = item.date.split('-')
          return { ...item, rgbColor, yyyy: yyyy + '年', mm: mm + '月', dd: dd + '号', days, dayInWeek, dateType: '起始'}
        } else if (item.date_type == 1) {
          let {days, dayInWeek} = calculateDataEachYear(item.date)
          let [mm, dd] = item.date.split('-')
          return { ...item, rgbColor, mm: mm + '月', dd: dd + '号', days, dayInWeek, dateType: '每年'}
        } else {
          let {days, dayInWeek} = calculateMonthlyData(item.date)
          return { ...item, rgbColor, dd: item.date + '号', days, dayInWeek, dateType: '每月'}
        }
      })
      let rawDataList = JSON.parse(JSON.stringify(data));
      let topDataList = JSON.parse(JSON.stringify(data));
      this.setData({
        // cardList: _userInfo.love_type ? topDataList : data,
        rawDataList,
        topDataList: topDataList.sort((a, b) => b.special_focus - a.special_focus)
      });
      let _userInfo = wx.getStorageSync('userInfo');
      this.getTypeData(_userInfo.love_type);
    }).finally(() => {
      // 取消加载
      // Toast.clear();
    })
  },
  
  // 获取用户信息
  getUserInfo() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: function (res) {
          get_login({
            code: res.code
          }).then(res => {
            resolve(res.data.data);
            wx.setStorageSync('userInfo', {...res.data.data})
          })

        },
        fail: function (error) {
          console.error(error);
          // 在异步操作失败时调用 reject
          reject(error);
        },
      });
    });
  },
  // 添加纪念日
  additionDay() {
    // 跳转到应用内非tabbar页面
    wx.navigateTo({
      url: '/pages/additionDay/index?title=创建'
    })
  },
  // 查看
  viewCard(event) {
    const item = event.currentTarget.dataset.item;
    // 转成字符串
    let paramsString = JSON.stringify({...item, sharePage: true}); // sharePage true不是分享或订阅进来的页面
    // 跳转到应用内非tabbar页面
    wx.navigateTo({
      url: '/pages/homeViewCard/index?params=' + paramsString
    })
  },

  // 切换背景类型
  switchBackgroundType(event) {
    this.setData({
      bg_type: event.detail.bg_type
    })
  },
  getTypeData(type) {
    if (type) {
      this.setData({
        cardList: this.data.topDataList
      })
    } else {
      this.setData({
        cardList: this.data.rawDataList
      })
    }
  },
  switchLoveType(event) {
    if (event.detail.love_type) {
      this.setData({
        cardList: this.data.topDataList
      })
    } else {
      this.setData({
        cardList: this.data.rawDataList
      })
    }
  }

});

// 打开右上角三个点的 转发给好友和朋友圈
// wx.showShareMenu({
//   withShareTicket: true,
//   menus: ['shareAppMessage', 'shareTimeline']
// })