import { getRequest, postRequest, putRequest, deleteRequest, uploadFileRequest}  from "./request" // 请求类型
// 登录
export const get_login = data => getRequest(`/get_login`, data);
// 修改信息
export const set_info_user = data => postRequest(`/set_info_user`, data);
// 修改信息
export const update_subscription_count = data => putRequest(`/update_subscription_count`, data);
// 获取用户信息
export const get_user = data => postRequest(`/get_user`, data);

// 获取纪念日
export const get_anniversary_list = data => getRequest(`/get_anniversary_list`, data);
// 添加纪念日
export const add_anniversary_list = data => postRequest(`/add_anniversary_list`, data);
// 编辑纪念日
export const edit_anniversary_list = data => putRequest(`/edit_anniversary_list`, data);
// 删除纪念日
export const delete_anniversary_list = data => deleteRequest(`/delete_anniversary_list`, data);

// 查询关联情况
export const get_associated_accounts = data => postRequest(`/get_associated_accounts`, data);
// 修改关联情况
export const set_associated_status = data => postRequest(`/set_associated_status`, data);
// 修改关联情况
export const set_associated_accounts_status = data => posputRequesttRequest(`/set_associated_accounts_status`, data);
// 请求关联账号
export const add_associated_accounts = data => postRequest(`/add_associated_accounts`, data);
// 取消关联账号
export const cancel_associated_accounts = data => postRequest(`/cancel_associated_accounts`, data);

// 不在重新关联对方账号 取消并清除关联信息
export const cancel_and_clear_association_info = data => postRequest(`/cancel_and_clear_association_info`, data);

// 获取共同关联的纪念日
export const get_anniversary_data = data => postRequest(`/get_anniversary_data`, data);
// 获取共同关联的纪念日
export const set_anniversary_data = data => putRequest(`/set_anniversary_data`, data);

// 获取节假日
export const get_upcoming_holidays = data => getRequest(`/get_upcoming_holidays`, data);

// 获取验证码
export const verify_code_emall = data => postRequest(`/verifyCodeEmall`, data);
// 校验验证码
export const verify_code = data => postRequest(`/verifyCode`, data);

// 上传文件
export const uploadFile = (filePath, name, formData) => {
  return uploadFileRequest(`/upload_image`, filePath, name, formData);
};
