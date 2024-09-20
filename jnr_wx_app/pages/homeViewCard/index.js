// pages/homeViewCard/index.js
import Toast from '@vant/weapp/toast/toast';
import { delete_anniversary_list }  from "../../apis/api" // 请求类型
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverUrl: '',
    cardData: {
      background_type: 1
    },
    showShare: false,
    options: [
      { name: '微信', icon: 'wechat', openType: 'share' },
      { name: '分享海报', icon: 'poster' },
      { name: '复制文本', icon: 'link'}
    ],
    deleteShow: false,
    sharePage: false,
    revealDateType: true,
    yyyymmdd: '',
    conversionDate: {
      years: '',
      months: '',
      days: ''
    }
  },

  // 编辑
  editData() {
    // 将对象序列化为字符串
    let paramsString = encodeURIComponent(JSON.stringify(this.data.cardData));
    // 跳转到应用内非tabbar页面
    wx.navigateTo({
      url: '/pages/additionDay/index?title=编辑&params=' + paramsString
    })
  },

  // 分享
  shareCard() {
    this.setData({
      showShare: true
    })
  },
  // 点击分享方式
  setShare(option) {
    if (option.detail.index == 0) {
      wx.showShareMenu({
      withShareTicket: true,
      success: function () {
        wx.showToast({
          title: '转发给好友成功',
          icon: 'success',
        });
      },
      fail: function () {
        wx.showToast({
          title: '转发给好友失败',
          icon: 'none',
        });
      },
    });
    } else if (option.detail.index == 1) {
      // this.setData({
      //   showShare: false
      // })
      Toast('开发中～');
      //属于tabbar的页面，只能通过wx.switchTab来跳转
      // wx.navigateTo({
      //   url: '/pages/posterPreview/index',
      // })
    } else {
      this.onCopyClick()
    }
  },
  // 在点击这个按钮时触发复制操作
  onCopyClick() {
    let {name, date, dayInWeek, classification, remark, days} = this.data.cardData
    // 要复制的文本内容
    let contentToCopy = ''
    switch (this.data.cardData.date_type) {
      case '0':
        contentToCopy = `-${name}-\n日期：${date}\n星期：${dayInWeek}\n类型：${classification}\n备注：${remark}\n已经${days}天啦！`;
        break;
      default:
        contentToCopy = `-${name}-\n日期：${date}\n星期：${dayInWeek}\n类型：${classification}\n备注：${remark}\n${days}天后为重要日子！`;
        break;
    }

    // 调用 wx.setClipboardData API 复制文本到粘贴板
    wx.setClipboardData({
      data: contentToCopy,
      success: function () {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 2000
        });
      },
      fail: function () {
        wx.showToast({
          title: '复制失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },
  // 关闭分享
  cancelShare() {
    this.setData({
      showShare: false
    })
  },

  onCloseDalete() {
    this.setData({
      deleteShow: false
    })
  },
  openDalete() {
    this.setData({
      deleteShow: true
    })
  },
  // 删除数据
  deleteDate() {
    // Toast.loading({
    //   duration: 0, // 持续展示 toast
    //   message: '正在删除',
    //   forbidClick: true
    // });
    let _userInfo = wx.getStorageSync('userInfo');
    delete_anniversary_list({parent_id: _userInfo.id, openid: _userInfo.openid, id: this.data.cardData.id}).then(res => {
      Toast.success('删除成功');
      wx.switchTab({
        url: '/pages/index/index'
      })
    }).catch(error => {
      Toast.fail('删除失败');
    }).finally(()=> {
      // Toast.clear();
    });
  },

  // 返回首页
  returnHome() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  daysToYearMonthDay() {
    let days = this.data.cardData.days;
    // 起始 类型
    if (this.data.cardData.date_type == '0') {
      let startDate = this.data.cardData.date;
      // 将开始日期和今天的日期转换为 Date 对象
      const start = new Date(startDate);
      const today = new Date();
      // 计算年、月、日差值
      let years = today.getFullYear() - start.getFullYear();
      let months = today.getMonth() - start.getMonth();
      let days = today.getDate() - start.getDate();
      // 调整月份和天数
      if (days < 0) {
        months -= 1;
        days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }
      this.setData({
        revealDateType: !this.data.revealDateType,
        conversionDate: {
          years: years,
          months: months,
          days: days
        }
      })
    } else {
      // 计算年份
      var years = Math.floor(days / 365);
      // 计算剩余天数
      var remainingDays = days % 365;
      // 计算月份
      var months = Math.floor(remainingDays / 30);
      // 计算剩余天数
      var remainingDays = remainingDays % 30;
      this.setData({
        revealDateType: !this.data.revealDateType,
        conversionDate: {
          years: years,
          months: months,
          days: remainingDays
        }
      })
    }
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    const app = getApp();
    let serverUrl = app.globalData.serverUrl;
    // 获取传递的参数字符串
    let paramsString = options.params;
    // 解码参数字符串并转换为对象     因为转发卡片（和订阅通知卡片）回来的数据是被编码的了，所以得解码
    let paramsObject = JSON.parse(decodeURIComponent(paramsString));
    // sharePage true不是分享或订阅进来的页面
    let sharePage = paramsObject.sharePage && getCurrentPages().length == 1 ? false : true
    this.setData({
      serverUrl,
      sharePage,
      cardData: paramsObject
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 监听用户分享操作
   */
  // onShareAppMessage() {
  // }
})