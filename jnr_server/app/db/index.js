// 数据库配置文件)
const mysql = require("mysql");
const config = require('../config/index'); // 引入配置文件

const databaseConfig = config.mysql;
// 配置数据库连接
const db = mysql.createPool(databaseConfig);

module.exports = db;
