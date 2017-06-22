/**
 * @file actions
 * Created by haner on 2017/3/27.
 */

import * as situationService from '../api/situation';
import {HTTP_STATUS} from '../commons/utils/code';
import CONSTANT from '../commons/utils/code';

export default {

    //获取省份列表
    getProvinceList: function({commit}){
        situationService.getProvinceList().then(res => {
            commit('SET_PROVINCE_LIST', res.data.data); 
            return res;
        });
    },

    //获取集团列表
    getCompanyList: function({commit}){
        return situationService.getCompanyList().then(res => {
            commit('SET_COMPANY_LIST', res.data.data);
            return res;
        });
    },

    //获取车场列表
    getParkList: function({commit},params){
        return situationService.getParkList(params).then(res => {
            commit('SET_PARK_LIST', res.data.data);
            return res;
        });
    },
}
