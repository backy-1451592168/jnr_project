// pages/posterPreview/index.js
import Wxml2Canvas from 'wxml2canvas';
import Toast from '@vant/weapp/toast/toast';
// const wxml2canvas = require('../../utils/wxml2canvas')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasHeight: 0
  },

  drawCanvas() {
    let _this = this
    let drawImage = new Wxml2Canvas({
      element: 'canvasId', // canvas节点的id,
      obj: _this, // 在组件中使用时，需要传入当前组件的this
      width: 390, // 宽高
      height: 500, // 这里的高度要动态获取
      background: '#fff', // 默认背景色
      progress() {
        // 绘制进度
      },
      async finish(tempFilePath) {

      },
      error(err) {
        console.log(err, 'err')
      }
    })
    
    let data = {
      //直接获取wxml数据
      list: [
        {
          type: 'wxml',
          // 第一个参数是绘制对象的根元素的类名，第二个参数是需要绘制节点的类名
          class: '.canvas_ele_limit, .title',
          limit: '.canvas_ele_limit',// 绘制对象的根元素的类名
          x: 0,
          y: 0
        }
      ]
    }

    drawImage.draw(data, this)
  },

  getElementHeight() {
    // 使用 wx.createSelectorQuery 创建一个查询对象
    const query = wx.createSelectorQuery();

    // 查询目标元素
    query.select('#targetElement').boundingClientRect();

    // 执行查询操作
    query.exec((res) => {
      this.setData({
        canvasHeight: res[0].height
      })
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getElementHeight();
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