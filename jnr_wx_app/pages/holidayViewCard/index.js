// pages/homeViewCard/index.js
import { calculateCumulativeData } from '../../utils/common'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    holidayData: {}
  },

  backPage() {
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取传递的参数字符串
    let paramsString = options.params;
    // 解码参数字符串并转换为对象
    let paramsObject = JSON.parse(decodeURIComponent(paramsString));
    let dataArr = paramsObject.date.split('-')
    let {dayInWeek} = calculateCumulativeData(paramsObject.date)
    this.setData({
      holidayData: {...paramsObject, dateTitle: `${dataArr[0]}年${dataArr[1]}月${dataArr[2]}日`, dayInWeek}
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