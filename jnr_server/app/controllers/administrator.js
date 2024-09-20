
const db = require("../db/index");

// 获取用户信息
exports.get_user_info = async (req, res) => {
  const { username, password } = req.query;

  // 查询管理员信息表，验证用户名和密码
  const adminQuery = `SELECT * FROM administrator_information WHERE name = ? AND password = ?`;
  db.query(adminQuery, [username, password], (adminErr, adminResult) => {
    if (adminErr) {
      console.error(new Date(), '：', adminErr);
      return res.json({ state: 501, message: adminErr });
    }
    // 如果未找到匹配的管理员账号，则认证失败
    if (adminResult.length === 0) {
      return res.json({ state: 401, message: "用户名或密码不正确" });
    }

    // 执行用户信息查询
    const userQuery = `SELECT COUNT(*) AS total_rows FROM user_accounts`;
    db.query(userQuery, (userErr, userResult) => {
      if (userErr) {
        console.error(new Date(), '：', userErr);
        return res.json({ state: 501, message: userErr });
      }
      return res.json({ state: 200, message: "查询成功", data: { ...userResult[0] } });
    });
  });
}

// 所有纪念日
exports.get_jnr_info = async (req, res) => {
  const { username, password } = req.query;
  console.log(username, password);

  // 查询管理员信息表，验证用户名和密码
  const adminQuery = `SELECT * FROM administrator_information WHERE name = ? AND password = ?`;
  db.query(adminQuery, [username, password], (adminErr, adminResult) => {
    if (adminErr) {
      console.error(new Date(), '：', adminErr);
      return res.json({ state: 501, message: adminErr });
    }
    // 如果未找到匹配的管理员账号，则认证失败
    if (adminResult.length === 0) {
      return res.json({ state: 401, message: "用户名或密码不正确" });
    }

    // 执行用户信息查询
    const userQuery = `SELECT * FROM anniversary_list`;
    db.query(userQuery, (userErr, userResult) => {
      if (userErr) {
        console.error(new Date(), '：', userErr);
        return res.json({ state: 501, message: userErr });
      }
      return res.json({ state: 200, message: "查询成功", data: userResult });
    });
  });
}
