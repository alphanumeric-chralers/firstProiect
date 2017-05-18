import axios from 'axios';

//let base = 'http://118.190.89.229:8080/springvue';
let base = '';
export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

export const hello = params => { return axios.get(`localhost:8080/hello`, { params: params }); };

export const reLogin = params => { return axios.post(`${base}/reLogin`, { params: params }); };

//测试redis
export const getUserLists = params => { return axios.get(`${base}/user/getUserList`, { params: params }); };

export const getUserInfo = params => { return axios.get(`${base}/user/getUserInfo`, { params: params }); };
//出口导入提交
export const exportList = params => { return axios.post(`${base}/exportList`, { params: params }); };


//获取主题单号列表
export const getMainNumber = params => { return axios.post(`${base}/getNumberInfo`,params).then(res => res.data); };

//获取主题单号列表
export const getNumberInfoGroup = params => { return axios.post(`${base}/getNumberInfoGroup`,params).then(res => res.data); };

//下载EXCEL模板
export const LoadExcelTemplate = params => { return axios.post(`${base}/LoadExcelTemplate`, { params: params }); };


export const ExportExcel = params => { return axios.post(`${base}/excel/download`, { params: params }); };

//获取船期大厅的内容
export const ShippingInfo = params => { return axios.get(`${base}/getShippingInfo`, { params: params }); };


//获取船期大厅的内容
export const getShipName = params => { return axios.post(`${base}/getShipName`, params).then(res => res.data); };

//获取船期
export const getShipNameBynumber = params => { return axios.post(`${base}/getShipNameBynumber`, params).then(res => res.data); };

//通过主单号获取详情信息
export const getAllByBillNumber = params => { return axios.post(`${base}/getAllByBillNumber`, params).then(res => res.data); };

//上传后台用户头像
export const UserAvatar = params => { return axios.post(`${base}/sysUserAvatar`, params).then(res => res.data); };
