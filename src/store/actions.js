/**
 * @file actions
 * Created by haner on 2017/3/27.
 */
import * as types from './mutation-types';
import * as situationService from '../api/situation';
import {HTTP_STATUS} from '../commons/utils/code';

export default {

    //获取省份列表
    getProvinceList({commit}){
        return situationService.getProvinceList().then(res => {
            res.status === HTTP_STATUS.SUCCESS.CODE && commit(types.GET_PROVINCE_LIET, res.data);
            return res;
        });
    },

    //获取集团列表
    getCompanyList({commit}){
        return situationService.getProvinceList().then(res => {
            res.status === HTTP_STATUS.SUCCESS.CODE && commit(types.GET_COMPANY_LITE, res.data);
            return res;
        });
    },


}
