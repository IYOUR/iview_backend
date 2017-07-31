/**
 * @file user
 * Created by haner on 2017/4/24.
 * @brief
 */
import axios from 'axios';
// import md5 from 'md5';
import Storage from '../commons/utils/storage';

//登录
export const login = params => {
    let data = Object.assign({}, params);
    data.password && (data.password = md5(data.password));
    return axios.post(`${axios.PARK_API}/auth/login`, data).then(res => res);
};


export const loginNow = params => axios.post(`${axios.PARK_API}/api/token`, {params:params}).then(res => res);

//修改密码
export const setPassword = params => axios.put(`${axios.PARK_API}user/${params.userName}`,params.val).then(res => res);
