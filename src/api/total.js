import axios from 'axios';
import Storage from '../commons/utils/storage';

//获取车场列表
export const getParksList = () => axios.post(`${axios.PARK_API}/parks`).then(res => res);

//获取收费统计数据
export const getChargeInfo = params => axios.post(`${axios.PARK_API}/charge_report`, params).then(res => res);

//获取支付情况统计数据
export const getPaymentInfo = params => axios.post(`${axios.PARK_API}/payment_report`, params).then(res => res);

//获取车流量统计
export const getTrafficInfo = params => axios.post(`${axios.PARK_API}/traffic_report`, params).then(res => res);
