/**
 * @file user
 * Created by haner on 2017/4/24.
 * @brief
 */
import axios from 'axios';
import md5 from 'md5';
import Storage from '../commons/utils/storage';

//登录
export const login = params => {
    let data = Object.assign({}, params);
    data.password && (data.password = md5(data.password));
    return axios.post(`${axios.PARK_API}/auth/login`, data).then(res => res);
};


export const loginNow = params => axios.post(`${axios.PARK_API}token`, {params:params}).then(res => res);

//修改密码
export const setPassword = params => axios.put(`${axios.PARK_API}user/${params.userName}`,params.val).then(res => res);

//获取账号列表
export const getAccount = params => axios.get(`${axios.PARK_API}account/`).then(res => res);

//添加账户
export const addAccount = params => axios.post(`${axios.PARK_API}account/`, params).then(res => res);

//修改账户
export const editAccount = params => axios.put(`${axios.PARK_API}account/`, params).then(res => res);

//删除账户
export const deleteAccount = params => axios.delete(`${axios.PARK_API}account/${params}`).then(res => res);

//封禁账户
export const disableAccount = params => axios.put(`${axios.PARK_API}account/off`, params).then(res => res);

//解禁账户
export const enableAccount = params => axios.put(`${axios.PARK_API}account/on`, params).then(res => res);
