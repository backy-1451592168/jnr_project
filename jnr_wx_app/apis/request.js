// 封装请求

// const app = getApp();
var tokenKey = "token";
import env from '../config/env.config'
//请求url;引用的是env.config.js中对应环境的
var serverUrl = env.env.VUE_APP_BASE_URL;
// var userInfo = wx.getStorageSync('userInfo');
// 例外不用token的地址
var exceptionAddrArr = ['/sys/login', ];
//请求头处理函数
function CreateHeader(url, type) {
  let header = {}
  if (type == 'POST_PARAMS') {
    header = {
      'content-type': 'application/x-www-form-urlencoded',
    }
  } else {
    header = {
      'content-type': 'application/json',
    }
  }
  // if (exceptionAddrArr.indexOf(url) == -1) { //排除请求的地址不需要token的地址
  //   let token = wx.getStorageSync(tokenKey);
  //   // header.Authorization = token;
  //   //请求头携带token还有租户id
  //   header['X-Access-Token'] = token;
  // }
  return header;
}

// get 请求
function getRequest(url, data) {
  wx.showLoading({
    title: '加载中...',
    mask: true, // 是否显示透明蒙层，防止触摸穿透
  });
  let header = CreateHeader(url, 'GET');
  return new Promise((resolve, reject) => {
    wx.request({
      url: serverUrl + url,
      data: data,
      header: header,
      method: 'GET',
      timeout: 30000,
      success: (res => {
        wx.hideLoading(); // 隐藏加载提示框
        //统一处理响应状态码
        if (res.data && res.data.state === 200) {
          resolve(res)
        } else {
          wx.showToast({
            icon: "none",
            title: res,
          });
          reject(res)
        }
      }),
      fail: (res => {
        wx.hideLoading();
        console.log("err!!!!", res)
        wx.showToast({
          icon: "none",
          title: '请求失败 请刷新',
        });
        reject(res)
      })
    })
  })
}
// post请求，数据在body中
function postRequest(url, data) {
  wx.showLoading({
    title: '加载中...',
    mask: true, // 是否显示透明蒙层，防止触摸穿透
  });
  let header = CreateHeader(url, 'POST');
  return new Promise((resolve, reject) => {
    wx.request({
      url: serverUrl + url,
      data: {
        ...data
      },
      header: header,
      method: 'POST',
      timeout: 30000,
      success: (res => {
        wx.hideLoading();
        if (res.data && res.data.state === 200) {
          resolve(res)
        } else {
          wx.showToast({
            icon: "none",
            title: (res.data && res.data.message) || "请求失败 请刷新",
          });
          reject(res)
        }
      })
    })
    fail: (res => {
      wx.hideLoading();
      console.log("err!!!!", res)
      wx.showToast({
        icon: "none",
        title: '请求失败 请刷新',
      });
      reject(res)
    })
  })
}
// put请求
function putRequest(url, data) {
  wx.showLoading({
    title: '加载中...',
    mask: true, // 是否显示透明蒙层，防止触摸穿透
  });
  let header = CreateHeader(url, 'PUT');
  return new Promise((resolve, reject) => {
    wx.request({
      url: serverUrl + url,
      data: data,
      header: header,
      method: 'PUT',
      timeout: 30000,
      success: (res => {
        wx.hideLoading();
        if (res.data && res.data.state === 200) {
          resolve(res)
        } else {
          wx.showToast({
            icon: "none",
            title: res,
          });
          reject(res)
        }
      })
    })
    fail: (res => {
      wx.hideLoading();
      console.log("err!!!!", res)
      wx.showToast({
        icon: "none",
        title: '请求失败 请刷新',
      });
      reject(res)
    })
  })
}
// delete请求
function deleteRequest(url, data) {
  wx.showLoading({
    title: '加载中...',
    mask: true, // 是否显示透明蒙层，防止触摸穿透
  });
  let header = CreateHeader(url, 'DELETE');
  return new Promise((resolve, reject) => {
    wx.request({
      url: serverUrl + url,
      data: data,
      header: header,
      method: 'DELETE',
      timeout: 30000,
      success: (res => {
        wx.hideLoading();
        if (res.data && res.data.state === 200) {
          resolve(res)
        } else {
          wx.showToast({
            icon: "none",
            title: res,
          });

          reject(res)
        }
      })
    })
    fail: (res => {
      wx.hideLoading();
      console.log("err!!!!", res)
      wx.showToast({
        icon: "none",
        title: '请求失败 请刷新',
      });
      reject(res)
    })
  })
}

// 封装文件上传请求
function uploadFileRequest(url, filePath, name, formData) {
  wx.showLoading({
    title: '加载中...',
    mask: true, // 是否显示透明蒙层，防止触摸穿透
  });
  let header = CreateHeader(url, 'POST'); // Assuming CreateHeader is defined somewhere
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: serverUrl + url,
      filePath: filePath,
      name: name,
      formData: {
        ...formData
      },
      header: header,
      success: (res) => {
        wx.hideLoading();
        const data = JSON.parse(res.data);
        if (data && data.state === 200) {
          resolve(data);
        } else {
          wx.showToast({
            icon: "none",
            title: (data && data.message) || "上传失败",
          });
          reject(data);
        }
      },
      fail: (res => {
        wx.hideLoading();
        console.log("err!!!!", res)
        wx.showToast({
          icon: "none",
          title: '请求失败 请刷新',
        });
        reject(res)
      })
    });
  });
}
module.exports.getRequest = getRequest;
module.exports.postRequest = postRequest;
module.exports.putRequest = putRequest;
module.exports.deleteRequest = deleteRequest;
module.exports.uploadFileRequest = uploadFileRequest;