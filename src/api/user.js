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

//登出
export const logout = () => {
    Storage.removeAll();
};

//是否登录
export const isLogin = () => getUser().token;

//获取用户信息
export const getUser = () => Storage.get(Storage.KEYS.USER) || {};

//获取用户信息
export const getUserInfo = () => axios.post(`${axios.PARK_API}/infoGet`, {}).then(res => res);

//编辑用户信息
export const editUserInfo = params => {
    params.old_password && (params.old_password = sha256(params.old_password));
    params.new_password && (params.new_password = sha256(params.new_password));
    return axios.post(`${axios.PARK_API}/infoEdit`, params).then(res => res);
};

// 修改密码
export const setUpPwd = params => {
    let data = Object.assign({}, params);
    data.oldpwd && (data.oldpwd = md5(data.oldpwd));
    return axios.post(`${axios.PARK_API}/auth/change_pwd`, data).then(res => {
        return res;
    });
};

//获取用户所选当前车场
export const getUserSelectPark = () => Storage.get(Storage.KEYS.CURRENT_PARK) || {};

//更新用户所选当前车场
export const setUserSelectPark = (parkCode) => Storage.set(Storage.KEYS.CURRENT_PARK, parkCode);

//待审查列表
export const getCheckingList = params => {
    !params && (params = {});
    params.park_code = UserService.getUserSelectPark().park_code;
    params.page_items = params. page_items || CommonState.PAGER.page_items;
    return axios.post(`${axios.PARK_API}/card/waite_for_apply`, params).then(res => res)
};