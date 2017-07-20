import axios from 'axios';
import * as UserService from './user';
import state from '../store/state';

export const setAppConfig = params => axios.post(`${axios.PARK_API}app/info`, params).then(res => res);

export const updateAppConfig = params => axios.put(`${axios.PARK_API}app/info/${params.id}`, params.val).then(res => res);

export const deleteConfig= params => axios.delete(`${axios.PARK_API}app/info/${params}`).then(res => res);

export const addUpdatePlan= params => axios.post(`${axios.PARK_API}app/plan`, params).then(res => res);

export const updatePlan= params => axios.put(`${axios.PARK_API}app/plan/${params.id}`, params.val).then(res => res);

export const deletePlan= params => axios.delete(`${axios.PARK_API}app/plan/${params}`).then(res => res);

export const getAppConfig= params => axios.get(`${axios.PARK_API}app/info`, {params: params}).then(res => res);

export const setConfigStatus= params => axios.put(`${axios.PARK_API}app/status?status=${params.status}&id=${params.id}`).then(res => res);

export const getUpdatePlan= params => axios.get(`${axios.PARK_API}app/plan`, {params: params}).then(res => res);

export const getEditHistory= params => axios.get(`${axios.PARK_API}app/log/${params.app_info_id}`, {params: params}).then(res => res);

export const getAreaName= params => axios.get('/site/getlocationlabel', {params: params}).then(res => res);