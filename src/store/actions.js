/**
 * @file actions
 * Created by haner on 2017/3/27.
 */

import * as situationService from '../api/situation';
import {HTTP_STATUS} from '../commons/utils/code';
import CONSTANT from '../commons/utils/code';
	import axios from 'axios';
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
    //获取查询结果
    getQueryResult: function({commit},params){
        let resultData = {},
		sendQueryResult = searchParam=> {
			return situationService.getQueryResult(searchParam.val).then(res => {
				if (res.status != CONSTANT.HTTP_STATUS.SUCCESS.CODE) {
					this.$Message.error(res.message || CONSTANT.HTTP_STATUS.SERVER_ERROR.MSG);
					return;
				};
				resultData[searchParam.name] = res.data;
				return resultData;
			});
		};   
        axios.all([
           sendQueryResult({name: 'defaultDay',val:params.defaultDay}), 
           sendQueryResult({name: 'lastDay',val:params.lastDay}),
           sendQueryResult({name: 'lastWeek',val:params.lastWeek}),
           sendQueryResult({name: 'lastMonth',val:params.lastMonth}),
           sendQueryResult({name: 'pastWeek',val:params.pastWeek})
        ]).then(axios.spread((acct, perms) => {
            commit('SET_QUERY_RESULT',perms);
        }));
    },
    //获取实时页面查询数据    
    getCurrentResult: function({commit},params){
        let resultData = {},
		sendQueryResult = searchParam=> {
			return situationService.getQueryResult(searchParam.val).then(res => {
				if (res.status != CONSTANT.HTTP_STATUS.SUCCESS.CODE) {
					this.$Message.error(res.message || CONSTANT.HTTP_STATUS.SERVER_ERROR.MSG);
					return;
				};
				resultData[searchParam.name] = res.data;
				return resultData;
			});
		};   
        axios.all([
           sendQueryResult({name: 'toDay',val:params.toDay}), 
           sendQueryResult({name: 'lastDay',val:params.lastDay})
        ]).then(axios.spread((acct, perms) => {
            commit('SET_CURRENT_DATA', perms);
        }));

    },    
}
