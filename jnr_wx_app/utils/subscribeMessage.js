/**
 * 订阅消息
 * @param { Array } [tmplIds]
 * @returns { Promise<Object> }
 */
export const subscribeMessage = (tmplIds = []) => {
  return new Promise((resolve, reject) => {
    wx.requestSubscribeMessage({
      tmplIds,
      success(res) {
        // 订阅成功
        if (res[tmplIds[0]] === 'accept' || res[tmplIds[1]] === 'accept') {
          resolve(res)
        } else {
          reject(res)
        }
      },
      fail: reject
    })
  })
}

// 获取订阅消息授权状态
export const getSubscribeMessageAuthStatus = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      withSubscriptions: true,
      success(res) {
        if (res.subscriptionsSetting.mainSwitch === true) {
          // 用户已经授权订阅消息
          resolve(true);
        } else if (res.subscriptionsSetting.mainSwitch === false) {
          // 用户已拒绝订阅消息
          resolve(false);
        }
      }
    });
  })
};

// 打开设置页面
export const openSettingForSubscribeMessage = () => {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success(res) {
        if (res.authSetting['scope.subscribeMessage'] === true) {
          // 用户已经允许订阅消息
          resolve('用户已开启订阅消息');
        } else if (res.authSetting['scope.subscribeMessage'] === false) {
          // 用户已拒绝订阅消息
          reject('用户已拒绝订阅消息，请手动开启');
        } else {
          // 用户尚未操作
          reject('用户未操作');
        }
      },
      fail(error) {
        reject('打开设置失败');
      },
    });
  });
};