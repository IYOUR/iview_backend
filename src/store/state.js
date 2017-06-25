/**
 * @file commonState
 * Created by haner on 2017/5/15.
 * @brief
 */

export default {


    //省份列表
    provinceList: [],

    //省份列表
    companyList: [],

    //车场列表
    parkList: [],

    //查询结果
    queryResult: {},

    //实时查询结果
    currentResult: {},

    //查询参数
    queryParam: {},

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
            {label:'完成停车数量',id:'dedup_finish'},
            {label:'完成停车次数',id:'finish'},
            {label:'总收入',id:'charge'},
            {label:'平均每辆车付费',id:'averageCharge'},
            {label:'平均每次停车付费',id:'eachCharge'},
            {label:'车位数量',id:'space'},
            {label:'停车场数量',id:'parks'}
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



    currentPageName: '',
    realTimeTabs:{
        tabOption:[
            {label:'实时进车次数',id:'currentIns'}, 
            {label:'实时出车次数',id:'currentOuts'},
            {label:'实时完成停车数',id:'currentFinish'},
            {label:'实时停数放量',id:'currentInparks'},
            {label:'实时车位使用率',id:'currentRatio'},
            {label:'实时收入',id:'currentCharge'},
            {label:'实时新增车辆数',id:'currentAdd'}
        ],
        tabChartsData:{}
    },   
    realTimeSituation: [
        {
            title:'实时进车次数',
            num: '00000',
            lastDay:['00',{val:'00',state:'no',icon:''}],	

        },
        {
            title:'实时出车次数',
            num: '00000',
            lastDay:['00',{val:'00',state:'no',icon:''}],	

        },
        {
            title:'实时完成停车数',
            num: '00000',
            lastDay:['00',{val:'00',state:'no',icon:''}],	

        },
        {
            title:'实时停数放量',
            num: '00000',
            lastDay:['00',{val:'00',state:'no',icon:''}],	

        },
        {
            title:'实时收入(元)',
            num: '00000',
            lastDay:['00',{val:'00',state:'no',icon:''}],	

        },
        {
            title:'实时新增车辆数',
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
                title: '完成停车次数',
                key: 'in_parks'
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
                key: 'in_parks'
            }																				
        ],
        data: []
    }, 


    parkDetailData: {},
    parkDetailTabs:{
        tabOption:[
            {label:'进场车数量',id:'ins'},
            {label:'出场车数量',id:'outs'},
            {label:'过夜车数量',id:'pass_nights'},
            {label:'车位使用率',id:'space_ratio'},
            {label:'平均停车时长',id:'parking_duration'},
            {label:'单位小时进出车辆数',id:'outsHour'},
            {label:'新增车辆数',id:'increased'}
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
                key: 'ins'
            },
            {
                title: '出场车数量',
                key: 'outs'
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
                title: '平均停车时长',
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




    paymentDetailData: {},
    paymentDetailTabs:{
        tabOption:[
            {label:'总收入',id:'charge'},
            {label:'平均每次付费',id:'eachTimesPay'},
            {label:'平均每车付费',id:'eachCarPay'},
            {label:'支付完成到抬杆平均时间',id:'eachFinish'},
            {label:'未支付用户比',id:'notPay'},
            {label:'车位平均价值',id:'spaceWorth'},
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
                title: '支付完成到抬杆平均时间(s)',
                key: 'eachFinish' 
            },
            {
                title: '未支付用户比',
                key: 'notPay'
            },
            {
                title: '车位平均价值(元)',
                key: 'spaceWorth'
            },
            {
                title: '平均停车时长',
                key: 'averageTime'
            },
            {
                title: '单位小时进出车辆数',
                key: 'inOutPerhour'
            }            	            																				
        ],
        data: []
    },                          
};
