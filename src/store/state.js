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
};
