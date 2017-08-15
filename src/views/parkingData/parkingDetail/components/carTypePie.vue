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
                        data: ['授权收费一车','授权收费二车','黑名单车','周期封顶车','商户优惠车','免费车',
                        '内部车','军警车','月租车','协议单位优惠车','员工车','储时车',
                        '储值周期封顶车','储值车','临时车','白名单车']
                    },
                    series : [
                        {
                            name: '进场车辆类型次数',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:[
                                {value:res[0].auth1_outs, name:'授权收费一车'},   
                                {value:res[0].auth2_outs, name:'授权收费二车'},  
                                {value:res[0].black_outs, name:'黑名单车'},  
                                {value:res[0].cap_outs, name:'周期封顶车'},  
                                {value:res[0].commercial_outs, name:'商户优惠车'},  
                                {value:res[0].free_outs, name:'免费车'},                              
                                {value:res[0].inside_outs, name:'内部车'},  
                                {value:res[0].military_police_outs, name:'军警车'},  
                                {value:res[0].monthly_outs, name:'月租车'},
                                {value:res[0].protocol_outs, name:'协议单位优惠车'},
                                {value:res[0].staff_outs, name:'员工车'},
                                {value:res[0].stored_time_outs, name:'储时车'},  
                                {value:res[0].stored_value_cap_outs, name:'储值周期封顶车'},
                                {value:res[0].stored_value_outs, name:'储值车'},
                                {value:res[0].temp_outs, name:'临时车'},
                                {value:res[0].write_outs, name:'白名单车'}

                            ],
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
            //表格显示数据处理
            showTableData(res) {
                let arr=[],data = res[0];
                for(let item in data){
                    arr.push(data[item])
                }         
                let sum = this.getSum(arr)
                this.tableShowData.data =[
                    {
                        type: '授权收费一车',
                        ratio : (!isNaN(data.auth1_outs/sum))? `${(data.auth1_outs/sum*100).toFixed(2)}%`:0
                    }, 
                    {
                        type: '授权收费二车',
                        ratio : (!isNaN(data.auth2_outs/sum))? `${(data.auth2_outs/sum*100).toFixed(2)}%`:0
                    }, 
                    {
                        type: '黑名单车',
                        ratio : (!isNaN(data.black_outs/sum))? `${(data.black_outs/sum*100).toFixed(2)}%`:0
                    }, 
                    {
                        type: '周期封顶车',
                        ratio : (!isNaN(data.cap_outs/sum))? `${(data.cap_outs/sum*100).toFixed(2)}%`:0
                    }, 
                    {
                        type: '商户优惠车',
                        ratio : (!isNaN(data.commercial_outs/sum))? `${(data.commercial_outs/sum*100).toFixed(2)}%`:0
                    }, 
                    {
                        type: '免费车',
                        ratio : (!isNaN(data.free_outs/sum))? `${(data.free_outs/sum*100).toFixed(2)}%`:0
                    },
                    {
                        type: '内部车',
                        ratio : (!isNaN(data.inside_outs/sum))? `${(data.inside_outs/sum*100).toFixed(2)}%`:0
                    }, 
                    {
                        type: '军警车',
                        ratio : (!isNaN(data.military_police_outs/sum))? `${(data.military_police_outs/sum*100).toFixed(2)}%`:0
                    }, 
                    {
                        type: '月租车',
                        ratio : (!isNaN(data.monthly_outs/sum))? `${(data.monthly_outs/sum*100).toFixed(2)}%`:0
                    }, 
                    {
                        type: '协议单位优惠车',
                        ratio : (!isNaN(data.protocol_outs/sum))? `${(data.protocol_outs/sum*100).toFixed(2)}%`:0
                    }, 
                    {
                        type: '员工车',
                        ratio : (!isNaN(data.staff_outs/sum))? `${(data.staff_outs/sum*100).toFixed(2)}%`:0
                    }, 
                    {
                        type: '储时车',
                        ratio : (!isNaN(data.stored_time_outs/sum))? `${(data.stored_time_outs/sum*100).toFixed(2)}%`:0
                    },  
                    {
                        type: '储值周期封顶车',
                        ratio : (!isNaN(data.stored_value_cap_outs/sum))? `${(data.stored_value_cap_outs/sum*100).toFixed(2)}%`:0
                    },   
                    {
                        type: '储值车',
                        ratio : (!isNaN(data.stored_value_outs/sum))? `${(data.stored_value_outs/sum*100).toFixed(2)}%`:0
                    },   
                    {
                        type: '临时车',
                        ratio : (!isNaN(data.temp_outs/sum))? `${(data.temp_outs/sum*100).toFixed(2)}%`:0
                    },   
                    {
                        type: '白名单车',
                        ratio : (!isNaN(data.write_outs/sum))? `${(data.write_outs/sum*100).toFixed(2)}%`:0
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