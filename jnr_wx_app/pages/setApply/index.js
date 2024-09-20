// pages/setApply/index.js
import { get_anniversary_list, get_anniversary_data, set_anniversary_data, cancel_associated_accounts }  from "../../apis/api" // 请求类型
import { calculateMonthlyData, calculateDataEachYear, calculateCumulativeData, hexToRgb } from '../../utils/common'
import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';
Page({

    /**
     * 页面的初始数据
     */
    data: {
      serverUrl: '',
      navbarTitle: '',
      sharePage: false,
      avatar_url: '',
      user_name: '',
      partner_data: {},
      association_status: 3,
      association_title: '-',
      showSettings: false,
      showHint: false,
      openAdd: false,
      selectiveData: [],
      selectiveDataList: [],
      anniversaryData: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
      const app = getApp();
      let serverUrl = app.globalData.serverUrl;
      // association_status 关联状态：0或null无关联、1请求关联中、2对方拒绝关联、3同意关联、4发起关联
      // 解码参数字符串并转换为对象     因为转发卡片（和订阅通知卡片）回来的数据是被编码的了，所以得解码
      let paramsObject = JSON.parse(decodeURIComponent(options.params));
      // sharePage true不是分享或订阅进来的页面
      let sharePage = paramsObject.sharePage && getCurrentPages().length == 1 ? true : false
      this.setData({
        serverUrl,
        openAdd: paramsObject.openAdd ? true : false,
        sharePage: paramsObject.sharePage || sharePage
      })
      let _userInfo = wx.getStorageSync('userInfo');
      // 获取共同关联的纪念日
      this.getAnniversaryData(_userInfo.id, _userInfo.openid)
      // 获取个人纪念日
      get_anniversary_list({id: _userInfo.id, openid: _userInfo.openid}).then(res => {
        let data = this.transformData(res.data.data)
        this.setData({
          selectiveDataList: data
        });
      }).finally(() => {
      })
    },

    // 获取共同关联的纪念日
    getAnniversaryData(id, openid) {
      get_anniversary_data({id, openid}).then(res => {
        let memorial_day_id = res.data.memorial_day_id ? res.data.memorial_day_id.split(',') : []
        let data = this.transformData(res.data.data)
        this.setData({
          anniversaryData: data,
          selectiveData: memorial_day_id
        })
      })
    },

    // 刷新
    refresh() {
      let _userInfo = wx.getStorageSync('userInfo');
      // 获取共同关联的纪念日
      this.getAnniversaryData(_userInfo.id, _userInfo.openid)
    },

    // 转换数据
    transformData(data) {
      let arr = data.map((item)=> {
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
      return arr;
    },

    // 保存
    confirm() {
      let _userInfo = wx.getStorageSync('userInfo');
      let {id, openid, shared_anniversary_id} = _userInfo
      let memorial_day_id = this.data.selectiveData.join()
      set_anniversary_data({id, openid, shared_anniversary_id, memorial_day_id}).then(res => {
        Toast('修改成功~');
        this.getAnniversaryData(id, openid)
        this.setData({
          openAdd: false
        })
      })
    },

    opHint() {
      this.setData({
        showHint: !this.data.showHint
      })
    },

    // 添加纪念日
    addMemorial() {
      this.setData({
        openAdd: true
      })
    },
    // 关闭 添加纪念日框
    onCloseAddMemorial() {
      this.setData({
        openAdd: false
      })
    },

    // 打开设置
    settings () {
      this.setData({
        showSettings: true
      })
    },
    // 关闭设置框
    onCloseSettings() {
      this.setData({
        showSettings: false
      })
    },

    // 选择纪念日
    onChange(event) {
      this.setData({
        selectiveData: event.detail,
      });
    },
    toggle(event) {
      const { index } = event.currentTarget.dataset;
      const checkbox = this.selectComponent(`.checkboxes-${index}`);
      checkbox.toggle();
    },

    // 跳转
    jumpIndex() {
      wx.navigateTo({
        url: '/pages/additionDay/index?title=创建&jumpPath=/pages/setApply/index'
      })
    },

    // 警告是否取消关联
    disassociate() {
      Dialog.confirm({
        title: '取消关联  ⚠️',
        message: '确定取消吗？取消将丢失共同的数据哦？😭',
        confirmButtonText: '残忍确认'
      }).then(() => {
        let _userInfo = wx.getStorageSync('userInfo');
        let {id, openid, identifier} = _userInfo
        cancel_associated_accounts({id, openid, identifier}).then(res => {
          Toast('结束了');
          let paramsString = encodeURIComponent(JSON.stringify({association_status: null, sharePage: true}));
          wx.navigateTo({
            url: '/pages/association/index?params=' + paramsString
          })
          // this.getAnniversaryData(id, openid)
          // this.setData({
          //   openAdd: false
          // })
        })
      }).catch(() => {
        Toast('嘻嘻，原来是点错啦');
      });
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
     * 用户点击右上角分享
     */
    // onShareAppMessage() {

    // }
})