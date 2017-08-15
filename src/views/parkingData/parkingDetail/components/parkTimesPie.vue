<style scoped>

</style>
<template>
    <Tabs type="card">
        <Tab-pane label="图表">
            <div id="payWayPie" style="width:100%; height:400px;"></div>
        </Tab-pane>
        <Button type="ghost" size="small" slot="extra" @click="exportData">导出CSV</Button>
        <Tab-pane label="表格">
            <Table border :columns="tableShowData.columns" :data="tableShowData.data" ref="table"></Table></Tab-pane>
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
            this.chartPie = echarts.init(document.getElementById('payWayPie'));
            this.chartPie.showLoading(); 
        },         
        watch:{
            'parkDetailData.tableSection':{
                deep:true,
                handler:function(newVal,oldVal){  
                    this.creatPie(newVal);
                    this.showTableData(newVal);
                },
            }
        },                 
        methods: {
            creatPie(res) {
                this.chartPie.hideLoading(); 
                this.chartPie.setOption({
                    // title : {
                    //     text: '支付渠道金额分布',
                    //     x:'center'
                    // },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['10分钟以内','30分钟以内','30分钟-60分钟','60分钟-120分钟',
                        '120分钟-360分钟','360分钟以上','24小时以上']
                    },
                    series : [
                        {
                            name: '停车车辆数',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:this.handlePieData(res),
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
            //图表显示数据处理
            handlePieData(res) {
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
                //累加计算
                let add = function(arr) {
                    if(Array.isArray(arr)){
                        return arr.reduce(function(x, y){
                            return x + y;
                        })
                    }
                    else return 0;
                }
                let pieData = [
                    {value:add(extract('duration_10m',res)), name:'10分钟以内'},
                    {value:add(extract('duration_30m',res)), name:'30分钟以内'},
                    {value:add(extract('duration_60m',res)), name:'30分钟-60分钟'},
                    {value:add(extract('duration_120m',res)), name:'60分钟-120分钟'},
                    {value:add(extract('duration_360m',res)), name:'120分钟-360分钟'},
                    {value:add(extract('duration_360m_up',res)), name:'360分钟以上'},
                    {value:add(extract('duration_24h_up',res)), name:'24小时以上'}
                ];
                return pieData;

            },
            showTableData(res) {
                let data = this.handlePieData(res),arr=[]
                for(let i=0;i<data.length;i++){
                    arr.push(data[i].value)
                }
                let sum = this.getSum(arr)
                this.tableShowData.data =[
                    {
                        type: '10分钟以内',
                        ratio : (!isNaN(data[0].value/sum))? `${(data[0].value/sum*100).toFixed(2)}%`:0
                    },
                    {
                        type: '30分钟以内',
                        ratio : (!isNaN(data[1].value/sum))? `${(data[1].value/sum*100).toFixed(2)}%`:0
                    },
                    {
                        type: '30分钟-60分钟',
                        ratio : (!isNaN(data[2].value/sum))? `${(data[2].value/sum*100).toFixed(2)}%`:0
                    },
                    {
                        type: '60分钟-120分钟',
                        ratio : (!isNaN(data[3].value/sum))? `${(data[3].value/sum*100).toFixed(2)}%`:0
                    },
                    {
                        type: '120分钟-360分钟',
                        ratio : (!isNaN(data[4].value/sum))? `${(data[4].value/sum*100).toFixed(2)}%`:0
                    },   
                    {
                        type: '360分钟以上',
                        ratio : (!isNaN(data[5].value/sum))? `${(data[5].value/sum*100).toFixed(2)}%`:0
                    },
                    {
                        type: '24小时以上',
                        ratio : (!isNaN(data[6].value/sum))? `${(data[6].value/sum*100).toFixed(2)}%`:0
                    },                                              
                ] 
            },
            getSum(arr) {
                if(Array.isArray(arr)){
                    return arr.reduce(function(x, y){
                        return parseFloat(x) + parseFloat(y);
                    })
                }
                else return 0;                
            },
            //导出数据
            exportData () {
                this.$refs.table.exportCsv({
                    filename: '停车时长分布'
                });
            },            
        }
    }
</script>