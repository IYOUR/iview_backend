/**
 * @file mall.js
 * Created by haner on 2017/5/10.
 * @brief
 */

import axios from 'axios';
import * as UserService from './user';
import CommonState from '../store/commonState';

//获取省份列表
export const getProvinceList = () => axios.get('site/getlocation').then(res => res);

//获取城市列表
export const getCityList = () => axios.get('site/getlocation').then(res => res);

//获取集团列表
export const getCompanyList = () => axios.get('site/getlocation').then(res => res);

//获取车场列表
export const getParkList = () => axios.get('site/getlocation').then(res => res);

//获取查询结果
export const getQueryResult = params => axios.get(`api/${axios.PARK_API}data/${params.url}`, {params: params.param}).then(res => res);

//export const getQueryResult = params => axios.get('site/getlocation', {params: params.param}).then(res => res);
