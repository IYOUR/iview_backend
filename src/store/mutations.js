/**
 * @file mutations
 * Created by haner on 2017/4/5.
 * @brief
 */


export default {

    SET_PROVINCE_LIST: (state, data) => {
        //console.log(list)
      state.provinceList = data
    },
    SET_COMPANY_LIST: (state, data) => {
      state.companyList = list
    },   
    SET_QUERY_RESULT: (state, data) => {
      state.queryResult = data
    }  
}
