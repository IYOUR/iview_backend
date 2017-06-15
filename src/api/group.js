
import axios from 'axios';
import md5 from 'md5';
import CommonState from '../store/commonState';

//获取集团用户列表
export const getUsers = params => {
	params = Object.assign({},CommonState.PAGER,params);
	return axios.post(`${axios.PARK_API}/users`, params).then(res => res);
};

//集团用户新建
export const createUser = params => {
    let data = Object.assign({}, params);
    data.password && (data.password = md5(data.password));
    return axios.post(`${axios.PARK_API}/user_create`, data).then(res => {
        return res;
    });
};

// 校验用户名是否存在
export const checkUser = params => axios.post(`${axios.PARK_API}/auth/check_user`, params).then(res => res);

//集团用户编辑
export const editUser = params => axios.post(`${axios.PARK_API}/user_edit`, params).then(res => res);