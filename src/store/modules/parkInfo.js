import * as situationService from '../../api/situation';
import {HTTP_STATUS} from '../../commons/utils/code';
import CONSTANT from '../../commons/utils/code';
import axios from 'axios';
import Storage from '../../commons/utils/storage';

const parkInfo = {
  state: {
    //省份列表
    provinceList: [],

    //城市列表
    cityList: [],

    //集团列表
    companyList: [],

    //车场列表
    parkList: [],

    //查询结果
    queryResult: {},

    //实时查询结果
    currentResult: {
        allResult: {},
        dateResult: {}
    },

    //查询参数
    queryData: {
        province: '',
        park_code: '',
        city: '',
        date: [],
        company: ''
    },
    queryParam: {},

    //排行数据
    rankData: {},
    
    situationData: [
        {
            title:'车位数量',
            num: '00000',
            lastDay:['00',{val:'00',state:'no',icon:''}],	
            lastWeek:['00',{val:'00',state:'no',icon:''}],
            lastMonth:['00',{val:'00',state:'no',icon:''}]
        },
        {
            title:'停车场数量',
            num: '00000',
            lastDay:['00',{val:'00',state:'no',icon:''}],	
            lastWeek:['00',{val:'00',state:'no',icon:''}],
            lastMonth:['00',{val:'00',state:'no',icon:''}]
        },
        {
            title:'完成停车辆数',
            num: '00000',
            lastDay:['00',{val:'00',state:'no',icon:''}],	
            lastWeek:['00',{val:'00',state:'no',icon:''}],
            lastMonth:['00',{val:'00',state:'no',icon:''}]
        },
        {
            title:'总收入(元)',
            num: '00000',
            lastDay:['00',{val:'00',state:'no',icon:''}],	
            lastWeek:['00',{val:'00',state:'no',icon:''}],
            lastMonth:['00',{val:'00',state:'no',icon:''}]
        },		
        {
            title:'平均每辆车付费(元)',
            num: '00000',
            lastDay:['00',{val:'00',state:'no',icon:''}],	
            lastWeek:['00',{val:'00',state:'no',icon:''}],
            lastMonth:['00',{val:'00',state:'no',icon:''}]
        }															
    ],
    situationTabs:{
        tabOption:[
            {label:'完成停车数量',id:'dedup_finish',hint:'一天之内至少完成一次停车的车辆数量（去重统计）'},
            {label:'完成停车次数',id:'finish',hint:'一天之内完成停车的总次数'},
            {label:'总收入',id:'charge',hint:'一天之内的付费金额'},
            {label:'平均每辆车付费',id:'averageCharge',hint:'总收入/完成停车数量'},
            {label:'平均每次停车付费',id:'eachCharge',hint:'总收入/完成停车次数'},
            {label:'车位数量',id:'space',hint:'可使用车位的总数量'},
            {label:'停车场数量',id:'parks',hint:'筛选条件下的停车场总数量'}
        ],
        tabChartsData:{}
    },  
    situationTable: {
        columns: [
            {
                title: '日期',
                key: 'date'
            },
            {
                title: '完成停车数量',
                key: 'dedup_finish'
            },
            {
                title: '完成停车次数',
                key: 'finish'
            },
            {
                title: '总收入(元)',
                key: 'charge'
            },
            {
                title: '平均每辆车付费(元)',
                key: 'averageCharge' 
            },
            {
                title: '平均每次停车付费(元)',
                key: 'eachCharge'
            },
            {
                title: '车位数量',
                key: 'space'
            },
            {
                title: '停车场数量',
                key: 'parks'
            }																				
        ],
        data: []
    },    
    //实时数据
    realTimeTabs:{
        tabOption:[
            {label:'实时进车次数',id:'currentIns',hint:'截止当前时间点，实时进车次数'}, 
            {label:'实时出车次数',id:'currentOuts',hint:'截止当前时间点，实时出车次数'},
            {label:'实时停放数量',id:'currentInparks',hint:'当前时间点，实时停车数量'},
            {label:'实时车位使用率',id:'currentRatio',hint:'当前时间点，在停车辆总数/车位数量'},
            {label:'实时收入',id:'currentCharge',hint:'截止当前时间点，实时收入金额'},
            {label:'实时新增车辆数',id:'currentAdd',hint:'截止当前时间点，首次使用艾润停车服务的总车辆数'},
        ],
        tabChartsData:{}
    },   
    realTimeSituation: [
        {
            title:'实时进车总次数',
            num: '00000',
            lastDay:['00',{val:'00',state:'no',icon:''}],	

        },
        {
            title:'实时出车总次数',
            num: '00000',
            lastDay:['00',{val:'00',state:'no',icon:''}],	

        },
        {
            title:'实时停放数量',
            num: '00000',
            lastDay:['00',{val:'00',state:'no',icon:''}],	

        },
        {
            title:'实时总收入(元)',
            num: '00000',
            lastDay:['00',{val:'00',state:'no',icon:''}],	

        },
        {
            title:'实时新增总车辆数',
            num: '00000',
            lastDay:['00',{val:'00',state:'no',icon:''}],
        }	        	        															
    ],  
    realTimeTable: {
        columns: [
            {
                title: '时间',
                key: 'date'
            },
            {
                title: '进车次数',
                key: 'ins'
            },
            {
                title: '出车次数',
                key: 'outs'
            },
            {
                title: '停放数量',
                key: 'in_parks' 
            },
            {
                title: '车位使用率',
                key: 'space_ratio'
            },
            {
                title: '收入(元)',
                key: 'charge'
            },
            {
                title: '新增车辆数',
                key: 'new'
            }																				
        ],
        data: []
    }, 

    //停车数据详情
    parkDetailData: {
        tableSection: [],
        carTypeInfo:[]        
    },
    parkDetailTabs:{
        tabOption:[
            {label:'进场车数量',id:'dedup_ins',hint:'按天统计进场车辆总数（去重）'},
            {label:'进场车次数',id:'ins',hint:'按天统计进场车辆总次数'},
            {label:'出场车数量',id:'dedup_outs',hint:'按天统计出场车辆总数（去重）'},
            {label:'出场车次数',id:'outs',hint:'按天统计出场车辆总次数'},
            {label:'过夜车数量',id:'pass_nights',hint:'当天进入停车场，但是在0点之前未出场的车辆总数'},
            {label:'车位使用率',id:'space_ratio',hint:'当天实时车位使用率的平均值'},
            {label:'平均停车时长',id:'parking_duration',hint:'按天统计停车场内所有完成停车车辆在停车场所停的平均时间'},
            {label:'单位小时进出车辆数',id:'outsHour',hint:'一天总的(进车数量+出车数量)/24'},
            {label:'新增车辆数',id:'increased',hint:'按天统计首次使用艾润停车服务的车辆总数'},
        ],
        tabChartsData:{}
    },  
    parkDetailTable: {
        columns: [
            {
                title: '时间',
                key: 'date'
            },
            {
                title: '进场车数量',
                key: 'dedup_ins'
            },
            {
                title: '出场车数量',
                key: 'dedup_outs'
            },
            {
                title: '过夜车数量',
                key: 'pass_nights'
            },
            {
                title: '车位使用率最高值',
                key: 'maxRatio' 
            },
            {
                title: '车位使用率最低值',
                key: 'minRatio'
            },
            {
                title: '车位使用率平均值',
                key: 'space_ratio'
            },
            {
                title: '平均停车时长(分钟)',
                key: 'averageTime'
            },
            {
                title: '单位小时进出车辆数',
                key: 'inOutPerhour'
            },
            {
                title: '新增车辆数',
                key: 'increased'
            }	            	            																				
        ],
        data: []
    },  
    //支付数据详情
    paymentDetailData: {
        tableSection: [],
        paySection:[]
    },
    paymentDetailTabs:{
        tabOption:[
            {label:'总收入',id:'charge',hint:'一天之内的付费金额'},
            {label:'平均每次付费',id:'eachTimesPay',hint:'总收入/完成停车数量'},
            {label:'平均每车付费',id:'eachCarPay',hint:'总收入/完成停车次数'},
            // {label:'未支付用户比',id:'notPay',hint:'当天出场车辆中，未付费的车辆占比'},
            {label:'车位平均价值',id:'spaceWorth',hint:'总收入/车位数'},
        ],
        tabChartsData:{}
    },
    paymentWayTabs:{
        tabOption:[
            {label:'微信',id:'weixin'},
            {label:'支付宝',id:'alipay'},
            {label:'银联',id:'uniopay'},
            {label:'现金',id:'cash'},
            {label:'停车王钱包',id:'wallet'},
            {label:'其他',id:'unkown'}
        ],
        tabChartsData:{}
    },    
    paymentDetailTable: {
        columns: [
            {
                title: '日期',
                key: 'date'
            },
            {
                title: '总收入(元)',
                key: 'charge'
            },
            {
                title: '平均每次付费(元)',
                key: 'eachTimesPay'
            },
            {
                title: '平均每车付费(元)',
                key: 'eachCarPay'
            },
            {
                title: '车位平均价值(元)',
                key: 'spaceWorth'
            },
            {
                title: '平均停车时长(分钟)',
                key: 'averageTime'
            },
            {
                title: '单位小时进出车辆数',
                key: 'inOutPerhour'
            }            	            																				
        ],
        data: []
    }, 
  },
  mutations: {
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
  },
  actions: {
    //获取省份列表
    getProvinceList: function({commit}){
        return situationService.getProvinceList().then(res => {
            commit('SET_PROVINCE_LIST', res.data.data); 
            return res;
        });
    },

    //获取集团列表
    getCompanyList: function({commit}){
        return situationService.getCompanyList().then(res => {
            //缓存全部集团数据
            if(sessionStorage.getItem('companyList')==null){
                sessionStorage.setItem('companyList',JSON.stringify(res.data.data))
            }            
            commit('SET_COMPANY_LIST', res.data.data);
            return res;
        });
    },

    //获取车场列表
    getParkLists: function({commit},params){
        return situationService.getParkList(params).then(res => {
            //缓存全部车场数据
            if(!params && sessionStorage.getItem('parkList')==null) {
                sessionStorage.setItem('parkList',JSON.stringify(res.data.data));
            }
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
            commit('SET_CURRENT_ALLDATA', perms);
        }));
    },   

    //获取实时页面某一天查询数据   
    getDateResult: function({commit},params){
        return situationService.getQueryResult(params).then(res => {
            commit('SET_CURRENT_DATEDATA', res.data);
            return res;
        });
    },

    //获取停车数据详情
    getParkDetail: function({commit},params){
        return situationService.getQueryResult(params).then(res => {
            commit('SET_PARK_DETAIL', res.data.data);
            return res;
        });
    },  
    //获取进场车辆类型数据
    getCarType: function({commit},params){
        return situationService.getCarType(params).then(res => {
            commit('SET_CAR_TYPE', res.data.data);
            return res;
        });
    },  

    //获取支付数据详情
    getPaymentDetail: function({commit},params){
        return situationService.getQueryResult(params).then(res => {
            commit('SET_PAYMENT_TABLESECTION', res.data.data);
            return res;
        });
    },  

    //获取支付渠道数据
    getPaymentResult: function({commit},params){
        return situationService.getPaymentResult(params).then(res => {
            commit('SET_PAYMENT_PAYSECTION', res.data.data);
            return res;
        });
    },  
    //获取排行数据
    getRankResult: function({commit},params){
        let resultData = {},
        sendQueryResult = searchParam=> {
          return situationService.getRankResult(searchParam.val).then(res => {
            if (res.status != CONSTANT.HTTP_STATUS.SUCCESS.CODE) {
              this.$Message.error(res.message || CONSTANT.HTTP_STATUS.SERVER_ERROR.MSG);
              return;
            };
            resultData[searchParam.name] = res.data;
            return resultData;
          });
        };   
        axios.all([
           sendQueryResult({name: 'finish',val:params.finish}), 
           sendQueryResult({name: 'space_ratio',val:params.space_ratio}),
           sendQueryResult({name: 'ins_outs',val:params.ins_outs}),
           sendQueryResult({name: 'charge',val:params.charge}),
           sendQueryResult({name: 'charge_by_space',val:params.charge_by_space}),                                 
        ]).then(axios.spread((acct, perms) => {
            commit('SET_RANK_DATA', perms);
        }));
    },      
  }
};

export default parkInfo;
