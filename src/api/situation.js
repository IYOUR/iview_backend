/**
 * @file mall.js
 * Created by haner on 2017/5/10.
 * @brief
 */

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
export const getQueryResult = params => axios.get(`api/${axios.PARK_API}data/${params.url}`, {params: params.param}).then(res => res);

//获取支付数据
export const getPaymentResult = params => axios.get(`api/${axios.PARK_API}charge/${params.url}`, {params: params.param}).then(res => res);

//获取排行数据
export const getRankResult = params => axios.get(`api/${axios.PARK_API}ranklist/${params.url}`, {params: params.param}).then(res => res);
//export const getQueryResult = params => axios.get('site/getlocation', {params: params.param}).then(res => res);
