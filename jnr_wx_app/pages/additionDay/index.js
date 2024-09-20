// pages/additionDay/index.js
import Toast from '@vant/weapp/toast/toast';
import { uploadFile, add_anniversary_list, edit_anniversary_list }  from "../../apis/api" // 请求类型
import { calculateMonthlyData, calculateDataEachYear, calculateCumulativeData } from '../../utils/common'
Page({
  data: {
    // 是否选中色轮
    isSelectColor: false,
    preset_color: 'rgb(0,0,0)',
    colorPickerShow: false,
    serverUrl: '',
    // 保存后 跳转的路径 默认跳转首页
    jumpPath: '/pages/index/index',
    dateData: {
      state: '编辑',
      date_type: 0,
      date: ''
    },
    dayInWeek: '',
    dateType: '',
    yyyy: '',
    mm: '',
    dd: '',
    // 请求类型 1创建 0 编辑
    requestType: '',
    navbarTitle: '',

    cardEdit: true,

    // 天数
    days: '',
    name: '',
    // 背景图片地址
    img_url: '',
    // 背景类型 1-颜色 0-图片
    background_type: 1,
    // 纪念日输入框错误提示
    vanFieldError: false,
    remark: '',
    showDate: false,
    special_focus_b: false,
    // 控制 预设背景 的开合
    activeNames: ['1'],
    dynamicHeight: 100,
    unfold: false,

    presetColorList: ['#d9ed92', '#b5e48c', '#99d98c', '#76c893', '#52b69a', '#34a0a4', '#168aad', '#1e6091', '#184e77'],
    preset_color: '#d9ed92',

    // 提前提醒
    remind: '当天',
    showRemindSheet: false,
    remindList: [
      {
        name: '当天',
        color: '#3e62f4'
      },
      {
        name: '一天前+当天'
      },
      {
        name: '一周前+当天'
      }
    ],

    // 分类标签
    classification: '默认',
    showActionSheet: false,
    actions: [
      {
        name: '默认',
        color: '#3e62f4'
      },
      {
        name: '纪念日',
      },
      {
        name: '工作',
      },
      {
        name: '学习',
      },
      {
        name: '重要',
      }
    ]
  },

  // 提示
  tip() {
    Toast({
      duration: 3500,
      message: '累计：计算累计天数                              每年、每月：计算剩余天数。'
    });
  },

  // 特别关注
  specialAttention() {
    this.setData({
      special_focus_b: !this.data.special_focus_b
    })
  },

  // 上传图片
  uploadPictures() {
    var _this = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      // mediaType: ['image','video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        uploadFile(tempFilePath, 'file', '').then(res => {
          _this.setData({
            background_type: 0,
            preset_color: '',
            img_url: res.data.url
            // img_url: tempFilePath
          })
          this.updateColorCheck();
        })
      }
    })
  },
  // 展开 预设背景
  onChange(event) {
    this.setData({
      activeNames: event.detail,
      dynamicHeight: event.detail.length ? 100 : 200,
      unfold: !this.data.unfold
    });
  },

  // 取消纪念日输入框错误提示
  cancelPrompt() {
    this.setData({
      vanFieldError: false
    })
  },
  
  // 下一步 返回
  switchCard(event) {
    if (this.data.name) {
      let date_type = this.data.dateData.date_type
      let date = this.data.dateData.date
      if (date_type == 0) {
        let {days, dayInWeek} = calculateCumulativeData(date)
        let [yyyy, mm, dd] = date.split('-')
        this.setData({yyyy: yyyy + '年', mm: mm + '月', dd: dd + '号', days, dayInWeek, dateType: '起始'})
      } else if (date_type == 1) {
        let {days, dayInWeek} = calculateDataEachYear(date)
        let [mm, dd] = date.split('-')
        this.setData({ mm: mm + '月', dd: dd + '号', days, dayInWeek, dateType: '每年'})
      } else {
        let {days, dayInWeek} = calculateMonthlyData(date)
        this.setData({ dd: date + '号', days, dayInWeek, dateType: '每月'})
      }
      this.setData({ navbarTitle: '预览', cardEdit: !this.data.cardEdit})
    } else {
      Toast.fail('纪念日没填');
      this.setData({
        vanFieldError: true
      })
    }
  },

  // 切换颜色
  switchPresetColor(event) {
    const selectedColor = event.currentTarget.dataset.color; // 获取点击的颜色
    this.setData({
      preset_color: selectedColor, // 更新当前选中的颜色
      background_type: 1
    });
    this.updateColorCheck();
  },

  // 触发日期选择器时，修改日期和类型
  sendData(e) {
    let data = e.detail
    this.setData({
      dateData: {
        date: data.date,
        date_type: data.date_type
      }
    })
  },

  // 保存
  saveData() {
    let _userInfo = wx.getStorageSync('userInfo');
    let special_focus = this.data.special_focus_b ? 1 : 0
    let { date, date_type } = this.data.dateData
    let {id, name, remind, classification, background_type, preset_color, remark, img_url} = this.data
    if (this.data.requestType) {
      add_anniversary_list({parent_id: _userInfo.id, openid: _userInfo.openid, date, date_type, id, name, remind, classification, background_type, preset_color, special_focus, remark, img_url}).then(res => {
        Toast('记录成功~');
        if (this.data.jumpPath == '/pages/index/index') {
          wx.switchTab({
            url: '/pages/index/index'
          })
        } else {
          // 如果是跳转到 绑定页面，则显示gohome按钮
          let paramsObject = JSON.stringify({sharePage: true, openAdd: true});
          wx.navigateTo({
            url: this.data.jumpPath + '?params=' + paramsObject
          })
        }
      }).finally(() => {
      })
    } else {
      edit_anniversary_list({parent_id: _userInfo.id, openid: _userInfo.openid, date, date_type, id, name, remind, classification, background_type, preset_color, special_focus, remark, img_url}).then(res => {
        Toast('修改成功~');
        wx.switchTab({
          url: '/pages/index/index'
        })
      }).finally(() => {
        // 取消加载
        // Toast.clear();
      })
    }
  },

  // 提前提醒
  openRemindSheet() {
    this.setData({
      showRemindSheet: true
    });
  },
  onSelectRemindSheet(event) {
    let data = this.data.remindList.map((item) => {
      if (item.name == event.detail.name) {
        return {
          name: item.name,
          color: '#3e62f4'
        }
      } else {
        return {
          name: item.name
        }
      }
    });
    this.setData({
      remind: event.detail.name,
      remindList: data
    })
  },

  // 打开分类下拉框
  openActionSheet() {
    this.setData({
      showActionSheet: true
    });
  },
  // 选择分类
  onSelectActionSheet(event) {
    let data = this.data.actions.map((item) => {
      if (item.name == event.detail.name) {
        return {
          name: item.name,
          color: '#3e62f4'
        }
      } else {
        return {
          name: item.name
        }
      }
    });
    this.setData({
      classification: event.detail.name,
      actions: data
    })
  },

  onCloseRemindSheet() {
    this.setData({
      showRemindSheet: false
    });
  },

  onCloseActionSheet() {
    this.setData({
      showActionSheet: false
    });
  },

  openColorPicker() {
    this.setData({
      colorPickerShow: true
    })

    //默认状态不需要设置
    this.colorPicker = this.selectComponent('#picker');
    this.setData({
      size: this.colorPicker.rpx2px(450)
    })
  },
  confirmColorPicker() {
    this.setData({
      colorPickerShow: false
    })
  },
  // 吸取颜色
  selectColor: function(e) {
    var that = this;
    that.setData({
      preset_color: e.detail.color
    })
    this.updateColorCheck();
  },
  // 是否选中色轮
  updateColorCheck() {
    const hasDifferent = this.data.presetColorList.findIndex(item => item == this.data.preset_color) == -1;
    this.setData({
      isSelectColor: hasDifferent
    });
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    const app = getApp();
    let serverUrl = app.globalData.serverUrl;
    this.setData({
      serverUrl
    })
    if (options.title == '创建') {
      let currentDate = new Date();
      // 当前年
      let currentYear = currentDate.getFullYear();
      // 当前月
      let currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
      // 获取当前日期的天数
      let currentDayIndex = currentDate.getDate().toString().padStart(2, '0');
      this.setData({
        jumpPath: options.jumpPath ? options.jumpPath : '/pages/index/index',
        dateData: {
          date: `${currentYear}-${currentMonth}-${currentDayIndex}`,
          date_type: 0
        },
        navbarTitle: options.title,
        requestType: 1
      })
    } else {
      let paramsString = options.params;
      // 解码参数字符串并转换为对象
      let paramsObject = JSON.parse(decodeURIComponent(paramsString));
      this.setData({
        dateData: {
          date: `${paramsObject.date}`,
          date_type: paramsObject.date_type
        },
        navbarTitle: options.title,
        requestType: 0,
        special_focus_b: paramsObject.special_focus == 1 ? true : false,
        ...paramsObject
      })
    }
    this.updateColorCheck();
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

  }

})