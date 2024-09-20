
const db = require("../db/index");

// 查询纪念日
exports.get_anniversary_list = async (req, res) => {
  try {
    let {id, openid} = req.query
    let {isCheckUserExist, message} = await checkUserExist(id, openid, false, '')
    if (isCheckUserExist) {
      let MEMORIAL_DAY_TABLE_NAME = 'user_accounts'
      // 根据 user_accounts表里的id查到 memorial_day_id 在拆开查 anniversary_list id
      const memorial_day_sql = `SELECT anniversary_list.*
        FROM anniversary_list
        JOIN ${MEMORIAL_DAY_TABLE_NAME} ON FIND_IN_SET(anniversary_list.id, ${MEMORIAL_DAY_TABLE_NAME}.memorial_day_id)
        WHERE ${MEMORIAL_DAY_TABLE_NAME}.id LIKE ?
        ORDER BY id DESC;
      `;
      db.query(memorial_day_sql, [id], (err, data) => {
        if (err) {
          console.error(new Date(), '：', err);
          return res.json({ state: 501, message: err });
        }
        return res.json({ state: 200, message: "查询成功", data });
      })
    } else {
      return res.send({state: 501, message})
    }
  } catch (error) {
    // 处理错误
    console.error(new Date(), '：', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 新增纪念日
exports.add_anniversary_list = async (req, res) => {
  // parent_id 用户id
  let { openid, parent_id, name, date, special_focus, date_type, remind, classification, remark, background_type, img_url, preset_color } = req.body
  try {
    let {isCheckUserExist, message} = await checkUserExist(parent_id, openid, false, '')
    if (isCheckUserExist) {
      const sql = "insert into anniversary_list set ?"
      db.query(sql, {parent_id, name, date, special_focus, date_type, remind, classification, remark, background_type, img_url, preset_color}, (err,results)=>{
        if (err) {
          console.error(new Date(), '：', err);
          return res.json({ state: 501, message: err });
        }
        if(results.affectedRows !== 1) {
          return res.send({state: 501, message: '数据添加失败'})
        }
        let id = results.insertId
        anniversary(1, id, parent_id, res)
        return res.send({state: 200, message: '添加成功', data: results})
      })
    } else {
      return res.send({state: 501, message})
    }
  } catch (error) {
    // 处理错误
    console.error(new Date(), '：', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 修改纪念日
exports.edit_anniversary_list = async (req, res) => {
  let { id, openid, parent_id, name, date, special_focus, date_type, remind, classification, remark, background_type, img_url, preset_color } = req.body
  try {
    let {isCheckUserExist, message} = await checkUserExist(parent_id, openid, true, id)
    if (isCheckUserExist) {
      const sql = "update anniversary_list set parent_id=?, name=?, date=?, special_focus=?, date_type=?, remind=?, classification=?, remark=?, background_type=?, img_url=?, preset_color=? where id=?";
      db.query(sql, [parent_id, name, date, special_focus, date_type, remind, classification, remark, background_type, img_url, preset_color, id], (err,results)=>{
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
      return res.send({state: 501, message})
    }
  } catch (error) {
    // 处理错误
    console.error(new Date(), '：', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 删除纪念日
exports.delete_anniversary_list = async (req, res) => {
  try {
    let {parent_id, id, openid} = req.body
    let {isCheckUserExist, message} = await checkUserExist(parent_id, openid, true, id)
    if (isCheckUserExist) {
      const sql = "delete from anniversary_list where id=?";
      db.query(sql, id, (err,results)=>{
        if (err) {
          console.error(new Date(), '：', err);
          return res.json({ state: 501, message: err });
        }
        if(results.affectedRows !== 1) {
          return res.send({state: 501, message: '数据删除失败'})
        }
        anniversary(0, id, parent_id, res)
        return res.send({state: 200, message: '删除成功', data: results});
      })
    } else {
      return res.send({state: 501, message});
    }
  } catch (error) {
    // 处理错误
    console.error(new Date(), '：', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 用户纪念日列表id 修改、删除、 纪念日列表id
function anniversary (type, id, parent_id, res) {
  const TABLE_NAME = 'user_accounts'
  const QUERY_STR = 'memorial_day_id';
  const  user_accounts_sql = `select ${QUERY_STR} from ${TABLE_NAME} where id like ?`;
  // 执行sql语句
  db.query(user_accounts_sql, [parent_id], (err, result) => {
    if (err) {
      console.error(new Date(), '：', err);
      return res.json({ state: 501, message: err });
    }
    let memorial_day_id = ''
    // 增加
    if (type) {
      memorial_day_id = result[0].memorial_day_id ? result[0].memorial_day_id + `,${id}` : id
    } else {
      // 删除
      let idList = result[0].memorial_day_id.split(',')
      let idIndex = idList.indexOf(String(id))
      idList.splice(idIndex, 1)
      memorial_day_id = idList.join(',')
    }
    const sql = `update ${TABLE_NAME} set memorial_day_id=? where id=?`;
    db.query(sql, [memorial_day_id, parent_id], (err, results)=>{
      if (err) {
        console.error(new Date(), '：', err);
        return res.json({ state: 501, message: err });
      }
    })
  })
}

// 校验用户是否存在  拿openid去查数据库，如果id和查出来的不一样 就判断非法输入
function checkUserExist(parent_id, openid, judgmentAuthority, id) {
  console.log('------',parent_id, openid, judgmentAuthority, id);
  return new Promise((resolve, reject) => {
    if (!parent_id || !openid) resolve(false);
    const user_accounts_sql = `select * from user_accounts where openid like ?`;
    let message = '点击右上角，重新进入小程序！';
    // 执行sql语句
    db.query(user_accounts_sql, [openid], (err, result) => {
      // 检查用户是否有操作该条数据权限
      if (judgmentAuthority) {
        let idArr = result[0].memorial_day_id.split(',');
        if (idArr.indexOf(String(id)) !== -1) {
          resolve({isCheckUserExist: true, message: '成功'});
        } else {
          resolve({isCheckUserExist: false, message: '非法输入：用户无权限操作该条数据！'});
        }
      } else {
        // true 用户存在
        resolve(result.length && result[0].id == parent_id ? {isCheckUserExist: true, message} : {isCheckUserExist: false, message});
      }
    })
  })
}