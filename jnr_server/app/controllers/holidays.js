const db = require("../db/index");

exports.get_upcoming_holidays = async (req, res) => {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2); // 月份是从 0 开始的，所以要加 1
    const day = ('0' + today.getDate()).slice(-2);
    const formattedDate = year + '-' + month + '-' + day;

    const TABLE_NAME = 'holidays_list'
    const holidaysSql = `SELECT *
      FROM ${TABLE_NAME}
      WHERE date >= '${formattedDate}';
    `;
    
    db.query(holidaysSql, (err, data) => {
      if (err) {
        console.error(new Date(), '：', err);
        return res.json({ state: 501, message: err });
      }

      return res.json({ state: 200, message: "查询成功", data });
    });
  } catch (error) {
    console.error(new Date(), '：', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
