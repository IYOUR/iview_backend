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
            if (res.status != CONSTANT.HTTP_STATUS.SUCCESS.CODE) {
                this.$Message.error(res.message || CONSTANT.HTTP_STATUS.SERVER_ERROR.MSG);
                return;
            };
            
            commit('SET_PROVINCE_LIST', res.data.data);
        });
    },

    //获取集团列表
    getCompanyList: function({commit}){
        return situationService.getProvinceList().then(res => {
            res.status === HTTP_STATUS.SUCCESS.CODE && commit('SET_COMPANY_LIST', res.data);
            return res;
        });
    },


}
