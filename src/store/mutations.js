/**
 * @file mutations
 * Created by haner on 2017/4/5.
 * @brief
 */


export default {

    SET_PROVINCE_LIST: (state, data) => {
      state.provinceList = data
    },
    SET_COMPANY_LIST: (state, data) => {
      state.companyList = data
    }, 
    SET_PARK_LIST: (state, data) => {
      state.parkList = data
    },     
    SET_QUERY_RESULT: (state, data) => {
      state.queryResult = data
    },  
    SET_QUERY_PARAM: (state, data) => {
      state.queryParam = data
    },
    SET_TABLE_DATA: (state, data) => {
      state.tableData = data
    },
    SET_CURRENT_ALLDATA: (state, data) => {
      state.currentResult.allResult = data
    },
    SET_CURRENT_DATEDATA: (state, data) => {
      state.currentResult.dateResult = data
    },
    SET_CURRENT_PAGNAME: (state, data) => {
      state.currentPageName = data
    },  
    SET_PARK_DETAIL: (state, data) => {
      state.parkDetailData.tableSection = data
    },    
    SET_PAYMENT_TABLESECTION: (state, data) => {
      state.paymentDetailData.tableSection = data
    },  
    SET_PAYMENT_PAYSECTION: (state, data) => {
      state.paymentDetailData.paySection = data
    },  
    SET_RANK_DATA : (state, data) => {
      state.rankData = data
    }, 
    SET_ADDPLAN_SHOW : (state, data) => {
      state.showAddPlan = data
    },     
    SET_ADDPLAN_ADD : (state, data) => {
      state.updatePlan = data
    },    
}
