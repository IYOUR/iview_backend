
import axios from 'axios';
import * as UserService from './user';
import state from '../store/state';

//获取省份列表
export const getProvinceList = () => axios.get('site/getlocation').then(res => res);

//获取城市列表
export const getCityList = params => axios.get('site/getlocation', {params: params}).then(res => res);

//获取集团列表
export const getCompanyList = () => axios.get('site/getallcompany').then(res => res);

//获取车场列表
export const getParkList = params => axios.get('site/getallpark', {params: params}).then(res => res);

//获取查询结果
export const getQueryResult = params => axios.get(`${axios.PARK_API}data/${params.url}`, {params: params.param}).then(res => res);

//获取车辆类型数据
export const getCarType = params => axios.get(`${axios.PARK_API}data/${params.url}/extra`, {params: params.param}).then(res => res);

//获取支付数据
export const getPaymentResult = params => axios.get(`${axios.PARK_API}charge/${params.url}`, {params: params.param}).then(res => res);

//获取排行数据
export const getRankResult = params => axios.get(`${axios.PARK_API}ranklist/${params.url}`, {params: params.param}).then(res => res);
//export const getQueryResult = params => axios.get('site/getlocation', {params: params.param}).then(res => res);

/* 网络性能监控 */
//获取网络性能监控数据
export const getNetworkResult = params => axios.get(`${axios.PARK_API}netcapability/${params.url}`, {params: params.param}).then(res => res);
//获取网络下发失败详情
export const getNetworkError = params => axios.get(`${axios.PARK_API}netcapability/${params.url}/fail`, {params: params.param}).then(res => res);
//获取网络下发超时详情
export const getNetworkTimeout = params => axios.get(`${axios.PARK_API}netcapability/${params.url}/timeout`, {params: params.param}).then(res => res);
//获取在线支付监控数据
export const getOnlinePay = params => axios.get(`${axios.PARK_API}paycapability/${params.url}`, {params: params.param}).then(res => res);

/* 数据仓库 */
//获取用户数据
export const getCarUserList = params => axios.get(`${axios.PARK_API}vpluser/list`).then(res => res);
//获取用户详情数据
export const getCarUserDetail = params => axios.get(`${axios.PARK_API}vpluser/info/${params}`).then(res => res);
//获取车场数据
export const getParkCenterList = params => axios.get(`${axios.PARK_API}park/list`).then(res => res);
//获取车场详情数据
export const getParkDetail = params => axios.get(`${axios.PARK_API}park/info/${params}`).then(res => res);
//获取车场实力指数
export const getParkExp = params => axios.get(`${axios.PARK_API}park/exp/${params.code}`, {params: params.param}).then(res => res);
