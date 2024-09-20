// 循环出年份
export function generateYearSequence(date_type, date) {
  // 获取当前年份
  let currentYear = new Date().getFullYear();
  let yearArr = []
  // 占位符
  let nullArr = []
  // 循环从 1950 年到当前年份后 20 年
  for (let year = 1950; year <= currentYear + 20; year++) {
    yearArr.push(year.toString());
    nullArr.push('*');
  }
  // 日期类型等于累计 并且 日期不为空 的时候 就取已有日期索引
  let yearIndex = date_type == 0 && date ? yearArr.indexOf(date.split('-')[0]) : yearArr.length - 21;
  return {yearArr, yearIndex, nullArr}
}

// 计算 该月天数
export function getDaysArrayInMonth(month, year) {
  // 如果未提供年份，则使用当前年份
  year = year || new Date().getFullYear();
  // JavaScript 中月份从 0 到 11，因此要减去 1
  month = month - 1;
  // 创建一个新的 Date 对象，设置为该月的第一天
  let firstDayOfMonth = new Date(year, month, 1);
  // 获取该月的最后一天
  let lastDayOfMonth = new Date(year, month + 1, 0);
  // 创建一个数组，包含该月的每一天
  let daysArray = [];
  for (let day = firstDayOfMonth.getDate(); day <= lastDayOfMonth.getDate(); day++) {
      // 将天数转换为两位数的字符串形式
      let dayString = ("0" + day).slice(-2);
      daysArray.push(dayString);
  }
  return daysArray;
}

// 计算天数、周几
export function calculateCumulativeData(val) {
  // 创建一个 Date 对象，传入日期字符串
  const dateObject = new Date(val);
  // 获取星期几的数值，0 表示星期日，1 表示星期一，以此类推
  const dayOfWeek = dateObject.getDay();
  // 将数值转换为星期几的字符串表示
  const daysOfWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  // 计算2个时间相差天数
  const timeDiff = Math.abs(new Date(val).getTime() - new Date().getTime());
  let days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return {
    dayInWeek: daysOfWeek[dayOfWeek],
    days
  }
}

// 计算每月数据
export function calculateMonthlyData(val) {
  let date = Number(val)
  let today = new Date();
  let nextMonth = new Date(today); // 复制当前日期

  // 判断是否超过当月
  if (today.getDate() > date) {
    // 超过了，将日期推到下一个月
    nextMonth.setMonth(today.getMonth() + 1);
    nextMonth.setDate(date);
  } else {
    // 没超过，计算当月剩余的天数
    nextMonth.setDate(date);
  }
  const dateObject = new Date(nextMonth);
  // 获取星期几的数值，0 表示星期日，1 表示星期一，以此类推
  const dayOfWeek = dateObject.getDay();
  // 将数值转换为星期几的字符串表示
  const daysOfWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  let days = Math.ceil((nextMonth - today) / (1000 * 60 * 60 * 24));
  return {
    dayInWeek: daysOfWeek[dayOfWeek],
    days
  }
}

// 计算每年数据
export function calculateDataEachYear(val) {
  let today = new Date();
  let [mm, dd] = val.split('-');
  let nextYear = new Date(today.getFullYear(), Number(mm - 1), Number(dd)); // 下一年
  // 当天日期 超过 设定日期 则改到下一年
  if (today.getMonth() + 1 >= Number(mm) && today.getDate() > Number(dd)) { // 月份从0开始
    // 超过了，将日期推到下一年
    nextYear.setFullYear(today.getFullYear() + 1);
  }
  const dateObject = new Date(nextYear);
  // 获取星期几的数值，0 表示星期日，1 表示星期一，以此类推
  const dayOfWeek = dateObject.getDay();
  // 将数值转换为星期几的字符串表示
  const daysOfWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  let days = Math.ceil((nextYear - today) / (1000 * 60 * 60 * 24));
  return {
    dayInWeek: daysOfWeek[dayOfWeek],
    days
  }
}

// 将十六进制颜色值转换为 RGB 格式
export function hexToRgb(hexColor) {
  // 判断是否为空 比如有了图片
  if (hexColor) {
    // 去除可能包含的 # 号
    hexColor = hexColor.replace(/^#/, '');
    // 将十六进制颜色值分解成红、绿、蓝的部分
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);
    // 返回 RGB 格式的字符串
    return `rgb(${r}, ${g}, ${b}, 0.18)`;
  } else {
    // return 'rgba(0, 0, 0, 0)'
    return 'rgb(82, 182, 154, 0.18)'
  }
}