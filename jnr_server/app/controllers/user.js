
const config = require('../../config');
const db = require("../db/index");
const axios = require('axios');

// 登陆 获取openid
exports.get_login = async (req, res) => {
  try {
    const TABLE_NAME = 'user_accounts'
    const QUERY_STR = 'id, identifier, subscription_remaining, user_name, bg_type, gender, avatar_url, memorial_day_id, timestamp, email';

    let appid = config.wechat.appid
    let secret = config.wechat.secret
    let js_code = req.query.code
    // 腾讯获取openid
    const response = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${js_code}&grant_type=authorization_code`);
    // 处理响应数据
    const responseData = response.data;
    // let session_key = responseData.session_key
    let openid = responseData.openid

    const user_accounts_sql = `select ${QUERY_STR} from ${TABLE_NAME} where openid like ?`;
    // 执行sql语句
    db.query(user_accounts_sql, [openid], (err, result) => {
      if (err) {
        console.error(new Date(), '：', err);
        return res.json({ state: 501, message: err });
      }
      // 查看用户是否存在
      if (result.length) {
        return res.json({ state: 200, message: "查询成功", data: { ...result[0], openid } });
      } else {
        // 新增用户
        let timestamp = new Date().getTime()
        const addInfor = { openid, timestamp }
        const sql = `insert into ${TABLE_NAME} set ?`;
        db.query(sql, addInfor, (err, results) => {
          // sql语句执行失败
          if (err) {
            console.error(new Date(), '：', err);
            return res.json({ state: 501, message: err });
          }
          if (results.affectedRows !== 1) {
            return res.send({ state: 501, message: '数据添加失败' })
          }
          let id = results.insertId
          // 更新 identifier
          let identifier = (id + 55).toString();

          // 如果加上 0 后的长度不超过 5 位数，补充 0
          while (identifier.length < 5) {
            identifier = '0' + identifier;
          }

          const updateSql = `UPDATE ${TABLE_NAME} SET identifier = ? WHERE id = ?`;
          db.query(updateSql, [identifier, id], (updateErr, updateResults) => {})
          
          // sql语句执行成功，影响条数也等于1
          return res.send({ state: 200, message: '添加成功', data: {id, openid, timestamp} })
        })
      }
    });
  } catch (error) {
    // 处理错误
    console.error(new Date(), '：', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 获取用户信息
exports.get_user = async (req, res) => {
  let openid = req.body.openid
  const sql = `select * from user_accounts where openid like ?`;
  db.query(sql, [openid], (err, result) => {
    if (err) {
      console.error(new Date(), '：', err);
      return res.json({ state: 501, message: err });
    }
    return res.json({ state: 200, message: "查询成功", data: { ...result[0], openid } });
  });
}

// 修改用户信息
exports.set_info_user = async (req, res) => {
  try {
    const TABLE_NAME = 'user_accounts'
    let {id, openid, user_name, gender, avatar_url, bg_type} = req.body

    let isCheckUserExist = await checkUserExist(id, openid)
    if (isCheckUserExist) {
      const sql = `update ${TABLE_NAME} set user_name=?, gender=?, avatar_url=?, bg_type=? where openid=?`;
      db.query(sql, [user_name, gender, avatar_url, bg_type, openid], (err,results)=>{
        if (err) {
          console.error(new Date(), '：', err);
          return res.json({ state: 501, message: err });
        }
        if(results.affectedRows !== 1) {
          return res.send({state: 501, message: '数据修改失败'})
        }
        return res.send({state: 200, message: '修改成功', data: results})
      })
    } else {
      return res.send({state: 501, message: '点击右上角，重新进入小程序！'})
    }
  } catch (error) {
    // 处理错误
    console.error(new Date(), '：', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// 修改订阅消息剩余次数
exports.update_subscription_count = async (req, res) => {
  try {
    const TABLE_NAME = 'user_accounts'
    let {id, openid, subscription_remaining} = req.body

    let isCheckUserExist = await checkUserExist(id, openid)
    if (isCheckUserExist) {
      const sql = `update ${TABLE_NAME} set subscription_remaining=? where openid=?`;
      db.query(sql, [subscription_remaining, openid], (err,results)=>{
        if (err) {
          console.error(new Date(), '：', err);
          return res.json({ state: 501, message: err });
        }
        if(results.affectedRows !== 1) {
          return res.send({state: 501, message: '数据修改失败'})
        }
        return res.send({state: 200, message: '修改成功', data: results})
      })
    } else {
      return res.send({state: 501, message: '点击右上角，重新进入小程序！'})
    }
  } catch (error) {
    // 处理错误
    console.error(new Date(), '：', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
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
