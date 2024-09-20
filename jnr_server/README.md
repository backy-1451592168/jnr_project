### node版本要求
- 16.15.1
- mysql Ver 8.0.26 

### 测试环境启动项目
```
  npm run start
```

### 生产环境启动项目
```
  node app.js
```

### 阿里云后端文件目录
```
   /usr/local/nginx/jnr_project
```

### 阿里云静态文件目录
```
   /home/data/file/jnr
```

### nginx
```bash
$ 配置文件路径：/usr/local/nginx/conf/nginx.conf      进入命令：vim nginx.conf
$ 退出编辑并保存：esc       :wq
$ 重启路径：/usr/local/nginx/sbin          启动命令：
$ 启动：./nginx
$ 关闭：./nginx -s stop
$ 重启：./nginx -s reload

    ！！！ 物理机、阿里云 nginx已经挂载到全局了，
    挂载指令： 
            export PATH=$PATH:/usr/local/nginx/sbin  # 添加路径到环境变量中
            source ~/.bashrc   # 保存
```

```bash
$ npm i
本地：
$ npm run dev  // 注释掉app.js代码
$ open http://localhost:7001/
服务器：
$ pm2 start app.js --name 'jnr_project'  // 打开app.js代码
$ 启动完后：pm2 save  开机自启
```

### 状态码规范
| 状态码 | 说明 |
| ------- | ------- |
| 503    | 找不到接口    |
| 501    | 数据库查询失败    |


## 规范

1. **项目根目录**：
   - `app.js`：主应用文件，通常包括 Express 应用的配置、中间件设置和路由的引入。

2. **路由**：
   - `routes/` 目录：用于存放路由相关的文件。
     - 其他路由文件，例如 `users.js` 或 `products.js`：每个文件包含与特定路由相关的路由处理函数。例如，用户认证、数据检索、创建、更新和删除等。

3. **控制器**：
   - `controllers/` 目录：用于存放控制器文件，控制器负责处理路由的具体业务逻辑。
     - 例如，`userController.js` 可以包含用户相关操作的业务逻辑。

4. **模型**：
   - `models/` 目录：用于存放数据库模型（通常使用 Mongoose 或 Sequelize 等库定义的数据结构）。
     - 例如，`userModel.js` 可以包含用户数据模型的定义。

5. **中间件**：
   - `middlewares/` 目录：用于存放自定义中间件函数，这些中间件可以用于路由或应用程序级别的处理。
     - 例如，身份验证中间件、日志中间件、错误处理中间件等。

6. **配置**：
   - `config/` 目录：用于存放应用程序配置文件。
     - 例如，数据库连接配置、环境变量配置、第三方服务配置等。

7. **服务**：
   - `services/` 目录：用于存放与业务逻辑相关的服务、操作数据库。
     - 例如，发送电子邮件、生成令牌、文件上传等功能的服务。

8. **静态资源**：
   - `public/` 目录：用于存放静态文件，例如图像、CSS、JavaScript 等。

9. **视图**（如果应用使用服务器端渲染）：
   - `views/` 目录：用于存放视图文件，通常使用模板引擎（如EJS、Handlebars等）来呈现页面。