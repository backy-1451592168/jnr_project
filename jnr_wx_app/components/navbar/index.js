import { set_info_user }  from "../../apis/api" // 请求类型
Component({
  // 组件的属性列表
  properties: {
    // 背景切换按钮
    isShowIcon: {
      type: Boolean,
      value: false
    },
    // 返回主页
    isGoHome: {
      type: Boolean,
      value: false
    },
    // 是否展示返回按钮
    isBackspace: {
      type: Boolean,
      value: false
    },
    // 背景颜色
    color: {
      type: String,
      value: '#f2f2f2'
    },
    // 标题
    title: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    topBarHeight: 0, //顶部盒子总高度
    // 0 纯色 1图片
    bg_type: 0,
    love_type: 0,
    loading: false,
    showSettings: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getNavHeight() {
      // 获取设备信息
      const sysInfo = wx.getSystemInfoSync();
      // 导航栏总高度 = 状态栏+44px
      const TopBarheight = sysInfo.statusBarHeight + 44;
      //异步更新数据
      wx.nextTick(() => {
        this.setData({
          topBarHeight: TopBarheight,
        })
      })
    },
    //回退
    navBack() {
      wx.navigateBack({
        delta: 1
      })
    },

    navGoHome() {
      wx.reLaunch({
        url: '/pages/index/index'
      })
    },

    openSettings() {
      this.setData({
        showSettings: true
      })
    },
    onCloseSettings() {
      this.setData({
        showSettings: false
      })
    },

    // 切换背景类型
    switchBackgroundType() {
      if (this.data.loading) return
      let _userInfo = wx.getStorageSync('userInfo');
      let bg_type = _userInfo.bg_type == 0 || !_userInfo.bg_type ? 1 : 0
      _userInfo = {..._userInfo, bg_type}
      wx.setStorageSync('userInfo', {..._userInfo})
      this.setData({
        bg_type
      })
      this.setData({
        loading: true,
      })
      set_info_user({..._userInfo}).then(res => {
        this.setData({
          loading: false,
        })
      }).finally(() => {
        this.setData({
          loading: false
        })
      })
      // 子向父组件传参
      this.triggerEvent('switchBackgroundType', {bg_type: this.data.bg_type})
    },

    switchLoveType() {
      let _userInfo = wx.getStorageSync('userInfo');
      let love_type = _userInfo.love_type == 0 || !_userInfo.love_type ? 1 : 0;
      _userInfo = {..._userInfo, love_type}
      wx.setStorageSync('userInfo', {..._userInfo})
      this.setData({
        love_type
      })
      // 子向父组件传参
      this.triggerEvent('switchLoveType', {love_type: this.data.love_type})
    }
  },
  created() {
    wx.nextTick(() => {
      this.getNavHeight()
      let _userInfo = wx.getStorageSync('userInfo');
      this.setData({
        bg_type: _userInfo.bg_type == 1 ? 1 : 0,
        love_type: _userInfo.love_type == 1 ? 1 : 0
      })
    })
  }
})