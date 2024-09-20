// pages/user/index.js
import Toast from '@vant/weapp/toast/toast';
import { get_upcoming_holidays, get_associated_accounts }  from "../../apis/api" // 请求类型
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverUrl: '',
    navbarTitle: "发现",
    date: '',
    year: '',
    daysPassed: '',
    progress: '',
    
    // 节假日列表
    holidaysList: [],
    holidays: {},
    // More status
    moreStatus: false,

    more: false,
    avatar_url: '',
    user_name: '',

    // 关联状态：0或null无关联、1请求关联中、2对方拒绝关联、3同意关联
    association_status: null,
    association_title: '去关联',
    partner_data: {},

    asLoading: true
  },

  // 打开关联详情页
  openAssociation() {
    let {association_status, asLoading, avatar_url, user_name} = this.data
    if (asLoading) return
    // 将对象序列化为字符串
    // association_status 关联状态：0或null无关联、1请求关联中、2对方拒绝关联、3同意关联、4发起关联
    let paramsString = encodeURIComponent(JSON.stringify({association_status, sharePage: false, partner_data:{avatar_url, user_name}}));
    if (association_status == 3) {
      wx.navigateTo({
        url: '/pages/setApply/index?params=' + paramsString
      })
    } else {
      wx.navigateTo({
        url: '/pages/association/index?params=' + paramsString
      })
    }
  },

  // 查看
  viewCard(e) {
    // 将对象序列化为字符串
    let paramsString = encodeURIComponent(JSON.stringify(e.currentTarget.dataset.obj));
    // 跳转到应用内非tabbar页面
    wx.navigateTo({
      url: '/pages/holidayViewCard/index?params=' + paramsString
    })
  },

  viewMore() {
    this.setData({
      more: !this.data.more
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const app = getApp();
    let serverUrl = app.globalData.serverUrl;
    this.setData({
      serverUrl
    })
  },

  setDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // 月份从 0 开始，所以需要加 1
    const day = currentDate.getDate();
    // 获取当前年份
    const currentYear = currentDate.getFullYear();
    // 计算今年的第一天
    const firstDayOfYear = new Date(currentYear, 0, 1);
    // 计算今年的最后一天
    const lastDayOfYear = new Date(currentYear, 11, 31);
    // 计算已经过了多少天 包括当天
    const daysPassed = Math.floor((currentDate - firstDayOfYear) / (1000 * 60 * 60 * 24)) + 1;
    // 计算还剩多少天 包括当天
    const daysRemaining = Math.floor((lastDayOfYear - currentDate) / (1000 * 60 * 60 * 24)) + 1;
    // 计算当年进度（已经过的天数占总天数的百分比）
    const progress = Number(((daysPassed / (daysPassed + daysRemaining)) * 100).toFixed(2));
    this.setData({
      year: year,
      date: `${year}/${month}/${day}`,
      daysPassed: daysPassed,
      progress: progress
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
    // Toast.loading({
    //   duration: 0, // 持续展示 toast
    //   message: '加载中...',
    //   forbidClick: true,
    // });
    let _userInfo = wx.getStorageSync('userInfo');
    let {avatar_url, user_name, id, openid} = _userInfo
    this.setData({
      avatar_url,
      user_name,
      asLoading: true
    })
    this.setDate()
    // 获取节假日
    get_upcoming_holidays('').then(res => {
      let data = res.data.data.map((item)=> {
        // 创建一个 Date 对象，传入日期字符串
        const dateObject = new Date(item.date);
        // 获取星期几的数值，0 表示星期日，1 表示星期一，以此类推
        const dayOfWeek = dateObject.getDay();
        // 将数值转换为星期几的字符串表示
        const daysOfWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

        // 计算2个时间相差天数
        const timeDiff = Math.abs(new Date(item.date).getTime() - new Date().getTime());
        let days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
        return {
          days,
          ...item
        }
      })
      this.setData({
        holidaysList: data,
        holidays: [data[0]]
      })
    }).finally(() => {
      // 取消加载
      // Toast.clear();
    })

    // 查询关联情况
    get_associated_accounts({id, openid}).then(res => {
      let {association_status, association_title, partner_data} = res.data
      this.setData({
        association_status,
        association_title,
        partner_data
      })
    }).finally(() => {
      this.setData({
        asLoading: false
      })
    })

    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1 // 设置底部导航栏的选中状态
      });
    }
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