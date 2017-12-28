<style scoped>

</style>
<template>
    <Tabs type="card">
        <Tab-pane label="图表">
            <div id="payTimes" style="width:100%; height:400px;"></div>
        </Tab-pane>
        <Button type="ghost" size="small" slot="extra" @click="exportData">导出CSV</Button>
        <Tab-pane label="表格">
            <Table border height="400" :columns="tableShowData.columns" :data="tableShowData.data" ref="table"></Table></Tab-pane>
    </Tabs>
</template>
<script>
    import echarts from 'echarts'
    import {mapState, mapActions, mapGetters} from 'vuex';
    export default {
        data (){
            return {
                chartPie:null,
                tableShowData: {
                    columns: [
                        {
                            title: '类型',
                            key: 'type'
                        },
                        {
                            title: '百分比',
                            key: 'ratio'
                        },
                    ],
                    data: [
                                                                                                 
                    ]
                },
            }
        }, 
        computed: {
            ...mapState({
                parkDetailData: 'parkDetailData'
            })                           
        },
        mounted:function(){
            this.chartPie = echarts.init(document.getElementById('payTimes'));
            this.chartPie.showLoading(); 
        },         
        watch:{
            'parkDetailData.carTypeInfo':{
                deep:true,
                handler:function(newVal,oldVal){
                    if(newVal.length>0) {
                        delete newVal[0].date;     
                        this.creatPie(newVal);
                        this.showTableData(newVal);                    
                    }
                },
            }
        },                 
        methods: {
            creatPie(res) {
                this.chartPie.hideLoading(); 
                this.chartPie.setOption({
                    // title : {
                    //     text: '进场车辆类型分布',
                    //     x:'center'
                    // },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['授权收费一次车','授权收费二次车','黑名单车','周期封顶车','商户优惠车','免费车',
                        '内部车','军警车','月租车','协议单位优惠车','员工车','储时车',
                        '储值周期封顶车','储值车','临时车','白名单车']
                    },
                    series : [
                        {
                            name: '进场车辆类型次数',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data: this.handlePieData(res),
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                });               
            },
            //图标显示数据处理
            handlePieData(res) {
                //提取一个类型的数据为数组
                let extract = function(item,res) {
                    if(res.length!=0){
                        let dataArr = [];
                        res.map((ele,index)=>{
                            dataArr.push(ele[item] || 0);
                        })
                          return dataArr;
                    } 
                    else return 0;
                };
                //累加
                let add = function(arr) {
                    if(Array.isArray(arr)){
                        return arr.reduce(function(x, y){
                            return x + y;
                        })
                    }
                    else return 0;
                };
                return [
                            {value:add(extract('auth1_outs',res)), name:'授权收费一次车'},
                            {value:add(extract('auth2_outs',res)), name:'授权收费二次车'},
                            {value:add(extract('black_outs',res)), name:'黑名单车'},
                            {value:add(extract('cap_outs',res)), name:'周期封顶车'},
                            {value:add(extract('commercial_outs',res)), name:'商户优惠车'},
                            {value:add(extract('free_outs',res)), name:'免费车'},
                            {value:add(extract('inside_outs',res)), name:'内部车'},
                            {value:add(extract('military_police_outs',res)), name:'军警车'},
                            {value:add(extract('monthly_outs',res)), name:'月租车'},
                            {value:add(extract('protocol_outs',res)), name:'协议单位优惠车'},
                            {value:add(extract('staff_outs',res)), name:'员工车'},
                            {value:add(extract('stored_time_outs',res)), name:'储时车'},
                            {value:add(extract('stored_value_cap_outs',res)), name:'储值周期封顶车'},
                            {value:add(extract('stored_time_outs',res)), name:'储值车'},   
                            {value:add(extract('temp_outs',res)), name:'临时车'},
                            {value:add(extract('white_outs',res)), name:'白名单车'},                                                                                                                
                        ];
            },            
            //表格显示数据处理
            showTableData(res) {
                let data = this.handlePieData(res),arr=[]
                for(let item in data){
                    arr.push(data[item].value)
                } 
                let sum = this.getSum(arr);
                this.tableShowData.data =[
                    {
                        type: '授权收费一车',
                        ratio : (!isNaN(data[0].value/sum))? `${(data[0].value/sum*100).toFixed(2)}%`:0
                    }, 
                    {
                        type: '授权收费二车',
                        ratio : (!isNaN(data[1].value/sum))? `${(data[1].value/sum*100).toFixed(2)}%`:0
                    }, 
                    {
                        type: '黑名单车',
                        ratio : (!isNaN(data[2].value/sum))? `${(data[2].value/sum*100).toFixed(2)}%`:0
                    }, 
                    {
                        type: '周期封顶车',
                        ratio : (!isNaN(data[3].value/sum))? `${(data[3].value/sum*100).toFixed(2)}%`:0
                    }, 
                    {
                        type: '商户优惠车',
                        ratio : (!isNaN(data[4].value/sum))? `${(data[4].value/sum*100).toFixed(2)}%`:0
                    }, 
                    {
                        type: '免费车',
                        ratio : (!isNaN(data[5].value/sum))? `${(data[5].value/sum*100).toFixed(2)}%`:0
                    },
                    {
                        type: '内部车',
                        ratio : (!isNaN(data[6].values/sum))? `${(data[6].values/sum*100).toFixed(2)}%`:0
                    }, 
                    {
                        type: '军警车',
                        ratio : (!isNaN(data[7].value/sum))? `${(data[7].value/sum*100).toFixed(2)}%`:0
                    }, 
                    {
                        type: '月租车',
                        ratio : (!isNaN(data[8].value/sum))? `${(data[8].value/sum*100).toFixed(2)}%`:0
                    }, 
                    {
                        type: '协议单位优惠车',
                        ratio : (!isNaN(data[9].valueu/sum))? `${(data[9].valueu/sum*100).toFixed(2)}%`:0
                    }, 
                    {
                        type: '员工车',
                        ratio : (!isNaN(data[10].value/sum))? `${(data[10].value/sum*100).toFixed(2)}%`:0
                    }, 
                    {
                        type: '储时车',
                        ratio : (!isNaN(data[11].value/sum))? `${(data[11].value/sum*100).toFixed(2)}%`:0
                    },  
                    {
                        type: '储值周期封顶车',
                        ratio : (!isNaN(data[12].value/sum))? `${(data[12].value/sum*100).toFixed(2)}%`:0
                    },   
                    {
                        type: '储值车',
                        ratio : (!isNaN(data[13].value/sum))? `${(data[13].value/sum*100).toFixed(2)}%`:0
                    },   
                    {
                        type: '临时车',
                        ratio : (!isNaN(data[14].value/sum))? `${(data[14].value/sum*100).toFixed(2)}%`:0
                    },   
                    {
                        type: '白名单车',
                        ratio : (!isNaN(data[15].value/sum))? `${(data[15].value/sum*100).toFixed(2)}%`:0
                    },                                                                                                                                                                                                             
                                      
                ] 
            },
            getSum(arr) {
                if(Array.isArray(arr)){
                    return arr.reduce(function(x, y){
                        return x + y;
                    })
                }
                else return 0;                
            },
            //导出数据
            exportData () {
                this.$refs.table.exportCsv({
                    filename: '进场车辆类型分布'
                });
            },            
        }
    }
</script>