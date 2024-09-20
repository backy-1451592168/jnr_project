// controllers/upload.js

const config = require('../config/index'); // 引入配置文件

const userConfig = config.userConfig;

const multer = require('multer');
var path = require('path')

var storage = multer.diskStorage({
  //上传文件到服务器的存储位置
  destination: userConfig.devUploadAvatarDir,  // 本地
  // destination: userConfig.alyProUploadAvatarDir,  // 阿里云
  filename: function (req, file, callback) {
    var fileFormat = (file.originalname).split('.')
    var filename = new Date().getTime()
    callback(null, filename + "." + fileFormat[fileFormat.length-1])
  }
})

const upload = multer({
  storage
});

exports.upload_image = (req, res) => {
  try {
    upload.single('file')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.error(new Date(), '：', err);
        return res.status(500).json({ error: 'Multer Error' });
      } else if (err) {
        console.error(new Date(), '：', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.send({ state: 200, msg: '上传成功', data: {url: '/user_file/' + req.file.filename} });
    });
  } catch (error) {
    console.error(new Date(), '：', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
