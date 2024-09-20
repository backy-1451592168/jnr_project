
const express = require('express');
const router = express.Router();

// 引入控制器或服务
const administrator = require('./controllers/administrator');
const user = require('./controllers/user');
const memorialDayController = require('./controllers/memorialDay');
const holidays = require('./controllers/holidays');
const upload = require('./controllers/upload');
const emall = require('./controllers/emall');

// 获取用户信息、数量、更新时间
router.get('/get_user_info', administrator.get_user_info);
// 所有纪念日
router.get('/get_jnr_info', administrator.get_jnr_info);

// 登陆 获取openid
router.get('/get_login', user.get_login);
// 获取用户信息
router.post('/get_user', user.get_user);
// 修改用户信息
router.post('/set_info_user', user.set_info_user);
// 修改订阅消息剩余次数
router.put('/update_subscription_count', user.update_subscription_count);

// 纪念日列表
router.get('/get_anniversary_list', memorialDayController.get_anniversary_list);
router.post('/add_anniversary_list', memorialDayController.add_anniversary_list);
router.put('/edit_anniversary_list', memorialDayController.edit_anniversary_list);
router.delete('/delete_anniversary_list', memorialDayController.delete_anniversary_list);


// 获取节假日
router.get('/get_upcoming_holidays', holidays.get_upcoming_holidays);

// 上传图片
router.post('/upload_image', upload.upload_image);

// 发送邮件 获取验证码
router.post('/verifyCodeEmall', emall.verifyCodeEmall);
// 校验验证码
router.post('/verifyCode', emall.verifyCode);

module.exports = router;