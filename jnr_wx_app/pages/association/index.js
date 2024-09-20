// pages/association/index.js
import { get_login, set_associated_status, get_associated_accounts, add_associated_accounts, cancel_and_clear_association_info, set_associated_accounts_status } from "../../apis/api.js"
import Toast from '@vant/weapp/toast/toast';
Page({
    // 页面的初始数据
    data: {
      sharePage: '',
      serverUrl: '',
      navbarTitle: '关联设置',
      association_status: null,
      partner_data: {
        avatar_url: ''
      }
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
      // association_status 关联状态：0或null无关联、1请求关联中、2对方拒绝关联、3同意关联、4发起关联
      let _userInfo = wx.getStorageSync('userInfo');
      // 从关联进来的用户 判断是否为新用户
      // 解码参数字符串并转换为对象
      let paramsObject = JSON.parse(decodeURIComponent(options.params));
      let association_status = paramsObject.partner_identifier !== _userInfo.identifier ? paramsObject.association_status : 1
      // 刷新关联状态 
      this.getStatus();

      if (_userInfo.openid) {
        this.setData({ ...paramsObject, association_status })
      } else {
        // 新用户 先登陆或者注册拿到 openid
        wx.login({
          success: function (res) {
            if (res.code) {
              // 发起网络请求
              get_login({
                code: res.code
              }).then(res => {
                let {id, openid} = res.data.data
                this.setData({
                  id, openid, ...paramsObject
                })
              }).finally(() => {
    
              })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        });
      }
    },

    getStatus() {
      let _userInfo = wx.getStorageSync('userInfo');
      let {id, openid} = _userInfo;
      get_associated_accounts({
        id, openid
      }).then(res => {
        let {association_status, shared_anniversary_id} = res.data
        // 关联成功 跳转到详情页
        if (association_status == 3) {
          wx.setStorageSync('userInfo', {..._userInfo, shared_anniversary_id})
          let paramsString = encodeURIComponent(JSON.stringify({association_status, partner_data: res.data.partner_data, sharePage: true}));
          wx.navigateTo({
            url: '/pages/setApply/index?params=' + paramsString
          })
        }
      })
    },

    // 修改关联情况 改为 请求中
    setAssociatedStatus() {
      let _userInfo = wx.getStorageSync('userInfo');
      let {id, openid} = _userInfo
      set_associated_status({
        id, openid, association_status: 1
      }).then(res => {
        this.setData({
          association_status: 1
        })
      })
    },
    // 刷新当前关联状态
    refreshState() {
      let _userInfo = wx.getStorageSync('userInfo');
      let {id, openid} = _userInfo
      get_associated_accounts({
        id, openid
      }).then(res => {
        let {association_status, shared_anniversary_id} = res.data
        Toast.success('刷新成功');
        this.setData({
          association_status
        })
        // 关联成功 跳转到详情页
        if (association_status == 3) {
          wx.setStorageSync('userInfo', {..._userInfo, shared_anniversary_id})
          let paramsString = encodeURIComponent(JSON.stringify({association_status, partner_data: res.data.partner_data, sharePage: true}));
          wx.navigateTo({
            url: '/pages/setApply/index?params=' + paramsString
          })
        }
      })
    },
    // 取消申请 修改关联状态
    cancelApplication(options) {
      let status = options.target.dataset.status
      let message = status == 1 ? '确定取消吗？对方可能在来的路上了😭' : status == 2 ? '确定取消吗？再挽留一下说不定还有机会😭' : '确定取消吗？努力一下还有机会的再挽留一下😭'
      Dialog.confirm({
        title: '取消关联  ⚠️',
        message,
        confirmButtonText: '残忍确认'
      }).then(() => {
        let _userInfo = wx.getStorageSync('userInfo');
        let {id, openid} = _userInfo
        // 清空关联状态
        if (status == 1 || status == 2) {
          set_associated_status({
            id, openid, association_status: null
          }).then(res => {
            Toast.success('取消成功');
            this.setData({
              association_status: null
            })
          })
        } else {
          // 不在重新关联对方账号
          cancel_and_clear_association_info({
            id, openid
          }).then(res => {
            Toast.success('取消成功');
            this.setData({
              association_status: null
            })
          })
        }
      }).catch(() => {
        Toast('嘻嘻，原来是点错啦');
      });
    },

    // 接受请求
    onConsent() {
      let _userInfo = wx.getStorageSync('userInfo');
      let {id, openid, identifier} = _userInfo
      add_associated_accounts({
        id,
        openid,
        identifier,
        partner_identifier: this.data.partner_identifier
      }).then(res => {
        let association_status = res.data.association_status
        // 关联成功 跳转到详情页
        if (association_status == 3) {
          Toast.success('关联成功');
          let paramsString = encodeURIComponent(JSON.stringify({association_status, partner_data: res.data.partner_data, sharePage: true}));
          wx.navigateTo({
            url: '/pages/setApply/index?params=' + paramsString
          })
        }
      }).finally(() => {

      })
    },
    // 残忍拒绝
    onRefuse() {
      Dialog.confirm({
        title: '取消关联  ⚠️',
        message: '确定拒绝吗？要不再考虑一下？😭',
        confirmButtonText: '残忍拒绝'
      }).then(() => {
        let _userInfo = wx.getStorageSync('userInfo');
        let {id, openid, identifier} = _userInfo
        set_associated_accounts_status({id, openid, identifier, association_status: 2}).then(res => {
          console.log(res);
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
    onShareAppMessage() {
      let _userInfo = wx.getStorageSync('userInfo');
      let {identifier} = _userInfo
      let {partner_data} = this.data
      // association_status 关联状态：0或null无关联、1请求关联中、2对方拒绝关联、3同意关联、4发起关联
      let paramsString = encodeURIComponent(JSON.stringify({partner_identifier: identifier, association_status: 4, partner_data}));
      
      return {
        title: 'backy请求关联',
        path: `/pages/association/index?params=${paramsString}`,
        // 长宽比是 5:4
        imageUrl: 'https://preview.cloud.189.cn/image/imageAction?param=D8DDBBA8698334917110E3421AFF5ACCC82F2813457E56C6A2421BB4EB9CA3AE277C8BA8EEBA31E4DA2D0130AEF38077A51EA6D809E0CDFC429FA4F9C97C4BDC740EC0246ED663E9440ADAA12AE9EC8F20CA09CCFF5C663A9E1347F3C63199FF3EB28C8C5E6D16A9D10AD7512CF6B2D8'
      }
    }
})