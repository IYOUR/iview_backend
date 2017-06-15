/**
 * @file mutations
 * Created by haner on 2017/4/5.
 * @brief
 */

import * as types from './mutation-types';

export default {
    [types.GET_PROVINCE_LIET](state, data){
        state.provinceList = data;
    },

    [types.GET_COMPANY_LITE](state, data){
        state.companyList = data;
    }
}
