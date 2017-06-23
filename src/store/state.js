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
            lastDay:['00000',{val:'00',state:'no',icon:''}],	
            lastWeek:['00000',{val:'00',state:'no',icon:''}],
            lastMonth:['00000',{val:'00',state:'no',icon:''}]
        },
        {
            title:'停车场数量',
            num: '00000',
            lastDay:['00000',{val:'00',state:'no',icon:''}],	
            lastWeek:['00000',{val:'00',state:'no',icon:''}],
            lastMonth:['00000',{val:'00',state:'no',icon:''}]
        },
        {
            title:'完成停车辆数',
            num: '00000',
            lastDay:['00000',{val:'00',state:'no',icon:''}],	
            lastWeek:['00000',{val:'00',state:'no',icon:''}],
            lastMonth:['00000',{val:'00',state:'no',icon:''}]
        },
        {
            title:'总收入(元)',
            num: '00000',
            lastDay:['00000',{val:'00',state:'no',icon:''}],	
            lastWeek:['00000',{val:'00',state:'no',icon:''}],
            lastMonth:['00000',{val:'00',state:'no',icon:''}]
        },		
        {
            title:'平均每辆车付费(元)',
            num: '00000',
            lastDay:['00000',{val:'00',state:'no',icon:''}],	
            lastWeek:['00000',{val:'00',state:'no',icon:''}],
            lastMonth:['00000',{val:'00',state:'no',icon:''}]
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
            lastDay:['00000',{val:'00',state:'no',icon:''}],	

        },
        {
            title:'实时出车次数',
            num: '00000',
            lastDay:['00000',{val:'00',state:'no',icon:''}],	

        },
        {
            title:'实时完成停车数',
            num: '00000',
            lastDay:['00000',{val:'00',state:'no',icon:''}],	

        },
        {
            title:'实时停数放量',
            num: '00000',
            lastDay:['00000',{val:'00',state:'no',icon:''}],	

        },
        {
            title:'实时收入(元)',
            num: '00000',
            lastDay:['00000',{val:'00',state:'no',icon:''}],	

        },
        {
            title:'实时新增车辆数',
            num: '00000',
            lastDay:['00000',{val:'00',state:'no',icon:''}],
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
};
