
export default {
    //停车场数据
    SET_PROVINCE_LIST: (state, data) => {
      state.provinceList = data
    },
    SET_COMPANY_LIST: (state, data) => {
      state.companyList = data
    }, 
    SET_PARK_LIST: (state, data) => {
      state.parkList = data
    },   
    SET_CITY_LIST: (state, data) => {
      state.cityList = data
    },        
    SET_QUERY_RESULT: (state, data) => {
      state.queryResult = data
    },  
    SET_QUERY_DATA: (state, data) => {
      state.queryData = data
    }, 
    SET_QUERY_PARAM: (state, data) => {
      state.queryParam = data
    }, 
    //实时数据
    SET_CURRENT_ALLDATA: (state, data) => {
      state.currentResult.allResult = data
    },
    SET_CURRENT_DATEDATA: (state, data) => {
      state.currentResult.dateResult = data
    },
    //停车数据详情
    SET_PARK_DETAIL: (state, data) => {
      state.parkDetailData.tableSection = data
    },
    SET_CAR_TYPE: (state, data) => {
      state.parkDetailData.carTypeInfo = data
    },    
    //支付数据详情
    SET_PAYMENT_TABLESECTION: (state, data) => {
      state.paymentDetailData.tableSection = data
    },  
    SET_PAYMENT_PAYSECTION: (state, data) => {
      state.paymentDetailData.paySection = data
    },  
    SET_RANK_DATA : (state, data) => {
      state.rankData = data
    }, 

    //app更新配置
    SET_ADDPLAN_SHOW : (state, data) => {
      state.showAddPlan = data
    },     
    SET_ADDPLAN_ADD : (state, data) => {
      state.updatePlan = data
    },    
    SET_PLAN_ID : (state, data) => {
      state.planId = data
    },  
    SET_EDIT_CONFIG_DATA : (state, data) => {
      state.editConfigData = data
    },     
    SET_CONFIG_CONFIG_TIME : (state, data) => {
      state.configEditTime = data
    },    
    SET_PREVIEW_STATE : (state, data) => {
      state.previewInfo = data 
    },   
    SET_CONFIRM_EDIT : (state, data) => {
      state.confirmEdit = data 
    },    
    
    //性能监控
    SET_NETEWORY_DAYDATA: (state, data) => {
      state.networkResultData.dayData = data
    },  
    SET_NETEWORY_RANGEDATA: (state, data) => {
      state.networkResultData.rangeData = data
    },  

    //在线支付监控
    SET_ONLINEPAY_DAYDATA: (state, data) => {
      state.onlinePayData.dayData = data
    },  
    SET_ONLINEPAY_RANGEDATA: (state, data) => {
      state.onlinePayData.rangeData = data
    }, 
    
    //数据仓库
    SET_USERCENTER_LIST: (state, data) => {
      state.userCenter_list = data
    },       
    SET_PARKCENTER_LIST: (state, data) => {
      state.parkCenter_list = data
    },    
}
