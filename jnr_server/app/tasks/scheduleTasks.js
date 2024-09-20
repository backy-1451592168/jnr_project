// tasks/scheduleTasks.js  定时任务
const config = require('../../config.js');

const schedule = require('node-schedule');

const db = require("../db/index");

const axios = require('axios');

const nodemailer = require('nodemailer');
const user_email = config.qqEmail.user_email;
const auth_code = config.qqEmail.auth_code;


// 设置每天的特定时间执行定时任务
const job = schedule.scheduleJob('30 09 * * *', function() {
  checkReminders();
});
// 手动触发 定时任务
// job.invoke();

// 检查是否提醒
function checkReminders() {
  const user_accounts_sql = `select * from anniversary_list`;
  // 执行sql语句
  db.query(user_accounts_sql, (err, result) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const lastDayOfMonth = new Date(year, month, 0).getDate(); // 判断本月有多少天

    let yyyymmdd = `${year}-${month}-${day}`
    let mmdd = `${month}-${day}`
    result.forEach(item => {
      let stateObj = getPreviousDaysDate(yyyymmdd, item.date_type, item.date, item.remind)
      // 0累计、1每年、2每月
      if (item.date_type == 1) {
        if (item.date == mmdd || stateObj.state) {
          sendEmail(item, yyyymmdd, stateObj.days)
          // 设置月份相同、设置日期大于本月最大日期、当天是本月最大日期
        } else if ((item.date.split('-')[0] == month) && (item.date.split('-')[1] > lastDayOfMonth) && (day == lastDayOfMonth)) {
          sendEmail(item, yyyymmdd, 0, '提醒：由于设置的提醒日期大于本月最大日期，导致邮件提前推送提醒，对此深感抱歉。')
        }
      } else if (item.date_type == 2) {
        if (item.date == day || stateObj.state) {
          sendEmail(item, yyyymmdd, stateObj.days)
          // 设置日期大于本月最大日期、当天是本月最大日期
        } else if ((item.date > lastDayOfMonth) && (day == lastDayOfMonth)) {
          sendEmail(item, yyyymmdd, 0, '提醒：由于设置的提醒日期大于本月最大日期，导致邮件提前推送提醒，对此深感抱歉。')
        }
      } else {
        if (item.date == yyyymmdd || stateObj.state) {
          sendEmail(item, yyyymmdd, stateObj.days)
        }
      }
    });
  })
}

// 判断是否提起提醒            提示日期   提起提起类型
function getPreviousDaysDate(yyyymmdd, date_type, date, remind) {
  if (remind !== '当天') {
    let currentDate;
    
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');  // 注意月份是从 0 开始计数的，所以要加 1

    // date_type 0累计、1每年、2每月
    if (date_type === '1') {
      currentDate = `${year}-${date}`;
    } else if (date_type === '2') {
      currentDate = `${year}-${month}-${date}`;
    } else {
      currentDate = date;
    }
    console.log(currentDate);
    let newDate = new Date(currentDate);
    console.log(newDate);
    let days = remind == '一天前+当天' ? 1 : 7
    newDate.setDate(newDate.getDate() - days);
    // resultDate前多少天的日期
    let resultDate = newDate.toISOString().substring(0, 10);
    console.log(yyyymmdd, date, resultDate);
    if (yyyymmdd == resultDate) {
      console.log('提醒');
      console.log('--------------');
      return {state: true, days: days - 1}
    } else {
      console.log(' 没提醒');
      console.log('--------------');
      return {state: false, days: days - 1}
    }
  } else {
    return {state: false, days: 0}
  }
}

// 发送邮件
function sendEmail(params, date, days, comment = "") {
  
  let {parent_id, name, classification, remark} = params
  let id = parent_id
  const sql = `select * from user_accounts WHERE id = ?`;
  // 执行sql语句
  db.query(sql, [id], (err, result) => {
    let {openid, subscription_remaining} = result[0]
    console.log('是否有推送权限', Boolean(subscription_remaining));
    // 发送微信订阅消息    用户授权了才可以推送
    if (subscription_remaining) sendSubscriptionMessage(params, openid, date, days, result[0])

    let email = result[0].email
    // 绑定邮箱的才可以发送
    if (email) {
      const transporter = nodemailer.createTransport({
        service: 'qq', // service
        secureConnection: true, // 安全连接
        port: 465,
        auth: {
          user: user_email, // 账号
          pass: auth_code, // 授权码
        },
      });

      const myModule = require('../assets/data.js');
      const html = myModule.html({parent_id, name, classification, remark, date});
      const mailOptions = {
        from: {
          name: 'DayCountdown 纪念日', // 发送者名称
          address: user_email, // 发送者邮箱
        },
        to: email, // 接收者账号,可以同时发送多个,以逗号隔开
        subject: `纪念日提醒：${name}`, // 标题
        text: '', // 文本
        html
      };
      // 发送邮件
      const success = transporter.sendMail(mailOptions);
    }
    const type = email ? '邮件提、微信订阅醒' : '微信订阅提醒'
    const sql = "insert into send_record set ?"
    // db.query(sql, {state, set_date, type, date}, (err,results)=>{})
  })

}

// 微信订阅消息
async function sendSubscriptionMessage(params, openid, date, days, userData) {
  // 将对象序列化为字符串    // sharePage true不是分享或订阅进来的页面
  let paramsString = encodeURIComponent(JSON.stringify({sharePage: false, ...params, days}))
  console.log(params, userData);
  // 获取access_token：https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/mp-access-token/getAccessToken.html
  const grant_type = 'client_credential'
  const appid = config.wechat.appid
  const secret = config.wechat.secret
  const {data} = await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=${grant_type}&appid=${appid}&secret=${secret}`)
  // 发送订阅消息：https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/mp-message-management/subscribe-message/sendMessage.html
  let day = 0
  let objData = {
    // 模板id
    "template_id": "vP1nBCcgYQWaIgyvRLEUssb-smzOi9RMTSV-xAmdnT0",
    "touser": openid,
    "data": {
      "thing6": { "value": params.name },
      "thing9": { "value": `${params.date_type == '1' ? '每年-' : params.date_type == '2' ? '每月' : ''}${params.date}` },
      "thing8": { "value": day },
      "thing1": { "value": params.classification },
      "thing5": { "value": params.remark ? params.remark : '重要的‼️' }
    },
    // sharePage true不是分享或订阅进来的页面
    "page": `/pages/homeViewCard/index?params=${paramsString}`, // 点击模板卡片后的跳转页面
    "miniprogram_state": "developer", // 跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版
    "lang": "zh_CN"
  }
  const response = await axios.post(`https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${data.access_token}`, objData)
  const state = response.data.errmsg
  const set_date = params.date

  // errcode 43101用户拒绝接受消息、0已发送至用户
  console.log('微信订阅提醒', response.data);
  // const type = '微信订阅提醒'
  // const sql = "insert into send_record set ?"
  // db.query(sql, {state, set_date, type, date}, (err,results)=>{})

  // // 用户拒绝消息推送了，清空次数
  let subscription_remaining = 0
  if (response.data.errcode == 0) {
    // 发送成功 减去一次推送次数
    subscription_remaining = userData.subscription_remaining - 1
  }
  // 更新
  const suserSql = "update user_accounts set subscription_remaining=? where openid=?"
  db.query(suserSql, [subscription_remaining, openid], (err,results)=>{})
}