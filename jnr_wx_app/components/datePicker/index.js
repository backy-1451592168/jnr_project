// components/datePicker/index.js
import { generateYearSequence, getDaysArrayInMonth } from '../../utils/common'
Component({
    // 父子传惨
    properties: {
      dateData: {
        type: Object,
        value: {}
      }
    },

    /**
     * 组件的初始数据
     */
    data: {
      columns: [],
      // 每年
      mnColumns: [],
      // 每月
      myColumns: [],
      // 累计
      ljColumns: [],
      date: '',
      date_type: 0
    },

    /**
     * 组件的方法列表
     */
    methods: {
      init() {
        let date_type = this.data.dateData.date_type;
        let stringArray = this.data.dateData.date.split('-');
        // 编辑时的 日期
        let currentYear = ''
        let currentMonth = ''
        let currentDayIndex = ''

        if (date_type == 0) {
          [currentYear, currentMonth, currentDayIndex] = stringArray.map(str => parseInt(str));
        } else if (date_type == 1) {
          [currentMonth, currentDayIndex] = stringArray.map(str => parseInt(str));
        } else {
          [currentDayIndex] = stringArray.map(str => parseInt(str));
        }
        // yearArr 年的数组 yearIndex 年的索引 nullArr *的数组
        let { yearArr, yearIndex, nullArr } = generateYearSequence(date_type, this.data.dateData.date);
        // 天的数组
        let  daysArray  = getDaysArrayInMonth(currentMonth, currentYear)
        // 日期类型索引
        let typeDefaultIndex = this.data.dateData.date_type
        let mnColumns = [
          {
            values: [ '累计','每年', '每月'],
            defaultIndex: typeDefaultIndex
          },
          {
            values: nullArr,
            defaultIndex: yearIndex
          },
          {
            values: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            defaultIndex: currentMonth - 1
          },
          {
            values: daysArray,
            defaultIndex: currentDayIndex - 1
          }
        ]
        let myColumns = [
          {
            values: [ '累计','每年', '每月'],
            defaultIndex: typeDefaultIndex
          },
          {
            values: nullArr,
            defaultIndex: yearIndex
          },
          {
            values: ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
            defaultIndex: currentMonth - 1
          },
          {
            values: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"],
            defaultIndex: currentDayIndex - 1
          }
        ]
        let ljColumns = [
          {
            values: ['累计', '每年', '每月'],
            defaultIndex: typeDefaultIndex
          },
          {
            values: yearArr,
            defaultIndex: yearIndex
          },
          {
            values: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            defaultIndex: currentMonth - 1
          },
          {
            values: daysArray,
            defaultIndex: currentDayIndex - 1
          }
        ]
        
        let columns = date_type == 0 ? ljColumns : date_type == 1 ? mnColumns : myColumns;
        this.setData({
          columns,
          mnColumns,
          myColumns,
          ljColumns
        })
      },
      onChange(event) {
        wx.nextTick(() => {
          let _this = this
          const { picker, value, index } = event.detail;
          let pickerTitle = value[0]
          if ((pickerTitle == '累计' || pickerTitle == '每年' || pickerTitle == '每月') && index !== 3) {
            let month = value[2] !== '*' ? value[2] : Number(new Date().getMonth()) + 1
            let year = value[1] !== '*' ? value[1] : Number(new Date().getFullYear())
            
            let data = getDaysArrayInMonth(month, year)
            let yearIndex = this.data.ljColumns[1].values.indexOf(year.toString())
            if (pickerTitle == '累计') {
              this.data.ljColumns[1].defaultIndex = yearIndex
              this.data.ljColumns[2].defaultIndex = month - 1
              this.data.ljColumns[3].values = data
              this.data.ljColumns[3].defaultIndex = data.length - 1
            } else if (pickerTitle == '每年') {
              this.data.mnColumns[2].defaultIndex = month - 1
              this.data.mnColumns[3].values = data
              this.data.mnColumns[3].defaultIndex = data.length - 1
            } else {
              this.data.myColumns[1].defaultIndex = 0
              this.data.myColumns[2].defaultIndex = 0
              this.data.myColumns[3].values = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"]
              this.data.myColumns[3].defaultIndex = data.length - 1
            }
          }
          let columns = pickerTitle == '累计' ? this.data.ljColumns : pickerTitle == '每年' ? this.data.mnColumns : this.data.myColumns
          // console.log(`当前值：${value}, 当前索引：${index}`);
          let date_type = pickerTitle == '累计' ? 0 : pickerTitle == '每年' ? 1 : 2;
          let date = ''
          // 切换类型时
          if (index == 0) {
            let y = columns[1].values[columns[1].defaultIndex]
            let m = columns[2].values[columns[2].defaultIndex]
            let d = columns[3].values[columns[3].defaultIndex]
            date = pickerTitle == '累计' ? `${y}-${m}-${d}` : pickerTitle == '每年' ? `${m}-${d}` : `${d}`
          } else {
            date = pickerTitle == '累计' ? `${value[1]}-${value[2]}-${value[3]}` : pickerTitle == '每年' ? `${value[2]}-${value[3]}` : `${value[3]}`
          }

          // 子向父组件传参
          this.triggerEvent('sendData', {date, date_type})

          this.setData({
            date,
            date_type,
            columns
          }, function() {
            // 在赋值成功的回调中设置选中值
            // 滚动类型
            if (index == 0) {
              // 默认当前年
              picker.setColumnIndex(1, columns[1].defaultIndex)
              // 默认当前月
              picker.setColumnIndex(2, columns[2].defaultIndex)
              // 默认当前天
              picker.setColumnIndex(3, columns[3].defaultIndex)
            } else if (index == 2){
              // 滚动月时 默认当前天
              picker.setColumnIndex(3, columns[3].defaultIndex)
            }
          })
        })
      }
    },

    created() {
      wx.nextTick(() => {
        // 设置传进来的参
        this.setData({
          date: this.data.dateData.date,
          date_type: this.data.dateData.date_type
        })
        this.init()
      })
    }
})