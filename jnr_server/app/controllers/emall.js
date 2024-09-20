
const config = require('../../config');
const db = require("../db/index");
const nodemailer = require('nodemailer');

const user_email = config.qqEmail.user_email;
const auth_code = config.qqEmail.auth_code;

const transporter = nodemailer.createTransport({
  service: 'qq', // service
  secureConnection: true, // 安全连接
  port: 465,
  auth: {
    user: user_email, // 账号
    pass: auth_code, // 授权码
  },
});


// 发送邮件
exports.verifyCodeEmall = async (req, res) => {
  let {id, openid, user_name, email, subject} = req.body

  const code = generateSixDigitCode();

  const html = 
  `
  <div style="background-color: #000001; width: 85vw; padding: 20px; ">
  <tbody>
    <tr>
      <td class="p-80 mpy-35 mpx-15" bgcolor="#212429" style="padding: 80px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <td class="img pb-45" style="font-size:0pt; line-height:0pt; text-align:left; padding-bottom: 45px;">
                <a href="https://store.steampowered.com/" target="_blank" rel="noopener">
                  <img src="https://jnr.backysu.cn/static/mail_icon.png" width="100px"
                    height="100px" border="0">
                </a>
              </td>
            </tr>
            <tr>
              <td>
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tbody>
                    <tr>
                      <td class="title-36 pb-30 c-grey6 fw-b"
                        style="font-size:36px; line-height:42px; font-family:Arial, sans-serif, 'Motiva Sans'; text-align:left; padding-bottom: 30px; color:#bfbfbf; font-weight:bold;">
                        ${user_name}，您好！</td>
                    </tr>
                  </tbody>
                </table>
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tbody>
                    <tr>
                      <td class="text-18 c-grey4 pb-30"
                        style="font-size:18px; line-height:25px; font-family:Arial, sans-serif, 'Motiva Sans'; text-align:left; color:#dbdbdb; padding-bottom: 30px;">
                        您帐户所需的 DayCountdown 令牌验证码 为：</td>
                    </tr>
                  </tbody>
                </table>
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tbody>
                    <tr>
                      <td class="pb-70 mpb-50" style="padding-bottom: 20px;">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#17191c">
                          <tbody>
                            <tr>
                              <td class="py-30 px-56"
                                style="padding-top: 30px; padding-bottom: 30px; padding-left: 56px; padding-right: 56px;">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                  <tbody>
                                    <tr>
                                      <td class="title-48 c-blue1 fw-b a-center"
                                        style="font-size:48px; line-height:52px; font-family:Arial, sans-serif, 'Motiva Sans'; color:#3a9aed; font-weight:bold; text-align:center;">
                                        ${code} </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tbody>
                    <tr>
                      <p style="color: #ffffff; font-weight: bold;margin-bottom: 24px;font-size: 26px;">验证码有效时间为 <span style="font-size: 32px;">5分钟</span> 。</p>
                      <td class="text-18 c-grey4 pb-30"
                        style="font-size:18px; line-height:25px; font-family:Arial, sans-serif, 'Motiva Sans'; text-align:left; color:#dbdbdb; padding-bottom: 30px;">
                        你收到这封邮件是因为有人正在通过 DayCountdown 小程序绑定邮箱。<br><br>
                        <span style="color: #ffffff; font-weight: bold;">如果你没有进行此操作，请联系 DayCountdown 小程序开发者，或者忽略此邮件。</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tbody>
                    <tr>
                      <td class="text-18 c-blue1 pb-40"
                        style="font-size:18px; line-height:25px; font-family:Arial, sans-serif, 'Motiva Sans'; text-align:left; color:#7abefa; padding-bottom: 40px;">
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tbody>
                    <tr>
                      <td class="pt-30" style="padding-top: 30px;">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tbody>
                            <tr>
                              <td class="img" width="3" bgcolor="#3a9aed"
                                style="font-size:0pt; line-height:0pt; text-align:left;"></td>
                              <td class="img" width="37" style="font-size:0pt; line-height:0pt; text-align:left;"></td>
                              <td>
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                  <tbody>
                                    <tr>
                                      <td class="text-16 py-20 c-grey4 fallback-font"
                                        style="font-size:16px; line-height:22px; font-family:Arial, sans-serif, 'Motiva Sans'; text-align:left; padding-top: 20px; padding-bottom: 20px; color:#f1f1f1;">
                                        祝您愉快，<br>
                                        DayCountdown。 </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</div>
  `
  ;
  // 获取当前时间的时间戳（单位：毫秒）
  const currentTimestamp = new Date().getTime();
  const mailOptions = {
    from: {
      name: 'DayCountdown 纪念日', // 发送者名称
      address: user_email, // 发送者邮箱
    },
    to: email, // 接收者账号,可以同时发送多个,以逗号隔开
    subject, // 标题
    text: '', // 文本
    html
  };
  try {
    let isCheckUserExist = await checkUserExist(id, openid)
    if (isCheckUserExist) {
      // 发送邮件
      const success = await transporter.sendMail(mailOptions);
      
      // 存储验证码和创建验证码时间
      const sql = "update user_accounts set code=? where id=?";
      let codeData = `${code}-${currentTimestamp}`
      db.query(sql, [codeData, id], (err,results)=>{
        if (err) {
          console.error(new Date(), '：', err);
          return res.json({ state: 501, message: err });
        }
        if(results.affectedRows !== 1) {
          return res.send({state: 501, message: '数据修改失败'})
        }
        return res.send({state: 200, message: '发送成功', data: results})
      })
    } else {
      return res.send({state: 501, message: '点击右上角，重新进入小程序！'})
    }
  } catch (err) {
    // 处理错误
    console.error(new Date(), '：', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 校验验证码
exports.verifyCode = async (req, res) => {
  let {id, openid, code, email} = req.body
  try {
    let isCheckUserExist = await checkUserExist(id, openid)
    if (isCheckUserExist) {
      const user_accounts_sql = `select * from user_accounts where openid like ?`;
      db.query(user_accounts_sql, [openid], (err, data) => {
        if (err) {
          console.error(new Date(), '：', err);
          return res.json({ state: 501, message: err });
        }
        let [oldCode, oldTimestamp] = data[0].code.split('-')
        if (isTimeDifferenceGreaterThanOneMinute(oldTimestamp)) {
          return res.json({ state: 200, message: "验证码过期了", codeState: 0 });
        } else {
          if (oldCode == code) {
            // 验证码校验成功，保存邮箱
            const sql = "update user_accounts set email=? where id=?";
            db.query(sql, [email, id], (err,results)=>{
              if (err) {
                console.error(new Date(), '：', err);
                return res.json({ state: 501, message: err });
              }
            })
            return res.json({ state: 200, message: "校验成功", codeState: 1 });
          } else {
            return res.json({ state: 200, message: "验证码错误", codeState: 0 });
          }
        }
      })
    } else {
      return res.send({state: 501, message: '点击右上角，重新进入小程序！'})
    }
    const sql = "SELECT * FROM user_accounts WHERE id = ?";
  } catch (error) {
    // 处理错误
    console.error(new Date(), '：', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


// 校验验证码是否过期
function isTimeDifferenceGreaterThanOneMinute(oldTimestamp) {
  // 将时间戳转换为秒
  const oldTimeInSeconds = Math.floor(oldTimestamp / 1000);
  const newTimeInSeconds = Math.floor(new Date().getTime() / 1000);

  // 计算时间差值（单位：秒）
  const timeDifference = newTimeInSeconds - oldTimeInSeconds;
  // 判断时间差是否大于300秒
  return timeDifference > 300;
}


// 生成六位数随机数
function generateSixDigitCode() {
  const code = Math.floor(Math.random() * 900000) + 100000;
  return code.toString(); // 转换为字符串
}

// 校验用户是否存在  拿openid去查数据库，如果id和查出来的不一样 就判断非法输入
function checkUserExist(id, openid) {
  return new Promise((resolve, reject) => {
    if (!id || !openid) resolve(false)
    const user_accounts_sql = `select * from user_accounts where openid like ?`;
    // 执行sql语句
    db.query(user_accounts_sql, [openid], (err, result) => {
      // true 用户存在
      resolve(result.length && result[0].id == id ? true : false);
    })
  })
}