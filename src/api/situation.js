import axios from 'axios';

let base = 'localhost';

export const requestLogin = params =>  axios.post(`${base}/login`, params).then(res => res);

export const getUserList = params => axios.get(`${base}/user/list`, params).then(res => res);

export const getParksList = () => axios.get(`${base}/user/listpage`).then(res => res);

export const getQueryResult = () => axios.get(`${base}/user/listpage`, params).then(res => res);
