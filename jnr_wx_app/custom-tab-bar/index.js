Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [
      {
        selectedIconPath: '/static/tabbar/home.png',
        iconPath: '/static/tabbar/off_home.png',
        label: '纪念日',
        pagePath: '/pages/index/index'
      },
      {
        selectedIconPath: '/static/tabbar/discover.png',
        iconPath: '/static/tabbar/off_discover.png',
        label: '发现',
        pagePath: '/pages/holiday/index'
      },
      {
        selectedIconPath: '/static/tabbar/user.png',
        iconPath: '/static/tabbar/off_user.png',
        label: '我的',
        pagePath: '/pages/user/index'
      }
    ]
  },
  attached() {
  },
  methods: {
    // 切换tab
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      this.setData({
        selected: data.index
      })
      // 震动
      wx.vibrateShort({type: 'medium'})
      wx.switchTab({url})
    }
  }
})