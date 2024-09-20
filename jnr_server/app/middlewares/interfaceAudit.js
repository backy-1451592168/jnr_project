// middlewares/customMiddleware1.js

module.exports = (req, res, next) => {
  // 判断接口
  const error = res.status(503).json({ error: '未找到接口！' });;
  
  // 将错误对象传递给下一个中间件或错误处理中间件
  next(error);
  // next()
};
