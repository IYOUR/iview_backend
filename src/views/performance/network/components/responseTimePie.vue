<style scoped>
.reposeDetail_Btn{
    position: absolute;
    bottom: 0px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9;  
}
</style>
<template>
    <Tabs type="card">
        <Tab-pane label="图表">
            <Button class="reposeDetail_Btn" @click="routerGo" type="primary">响应>5S详情</Button>
            <div id="responseTimePie" style="width:100%; height:400px;"></div>
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
                            title: '次数',
                            key: 'money'
                        },
                        {
                            title: '占比',
                            key: 'ratio'
                        }
                    ],
                    data: [
                                                                                                 
                    ]
                },
            }
        }, 
        computed: {
            ...mapState({
                queryData: 'queryData',
                networkResultData: 'networkResultData',
            }),                          
        },
        mounted:function(){
            this.chartPie = echarts.init(document.getElementById('responseTimePie'));
            this.chartPie.showLoading(); 
        },         
        watch:{
            'networkResultData.rangeData':{
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
                    title : {
                        text: '下发响应时长分布',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['1秒内','2秒内','5秒内','10秒内','30秒内','30秒以上']
                    },
                    series : [
                        {
                            name: '响应时长分布(s)',
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

                return [
                        {value:add(extract('response_time_1s',res)), name:'1秒内'},
                        {value:add(extract('response_time_2s',res)), name:'2秒内'},
                        {value:add(extract('response_time_5s',res)), name:'5秒内'},
                        {value:add(extract('response_time_10s',res)), name:'10秒内'},
                        {value:add(extract('response_time_30s',res)), name:'30秒内'},
                        {value:add(extract('response_time_30s_up',res)), name:'30秒以上'},
                       ];
            },
            showTableData(res) {
                let data = this.handlePieData(res),arr=[]
                for(let i=0;i<data.length;i++){
                    arr.push(data[i].value)
                }
                let sum = this.getSum(arr)
                this.tableShowData.data =[
                    {
                        type: '1秒内',
                        money: data[0].value,
                        ratio : (!isNaN(data[0].value/sum))? `${(data[0].value/sum*100).toFixed(2)}%`:0
                    },
                    {
                        type: '2秒内',
                        money: data[1].value,
                        ratio : (!isNaN(data[1].value/sum))? `${(data[1].value/sum*100).toFixed(2)}%`:0
                    },
                    {
                        type: '5秒内',
                        money: data[2].value,
                        ratio : (!isNaN(data[2].value/sum))? `${(data[2].value/sum*100).toFixed(2)}%`:0
                    },
                    {
                        type: '10秒内',
                        money: data[3].value,
                        ratio : (!isNaN(data[3].value/sum))? `${(data[3].value/sum*100).toFixed(2)}%`:0
                    },
                    {
                        type: '30秒内',
                        money: data[4].value,
                        ratio : (!isNaN(data[4].value/sum))? `${(data[4].value/sum*100).toFixed(2)}%`:0
                    },
                    {
                        type: '30秒以上',
                        money: data[5].value,
                        ratio : (!isNaN(data[5].value/sum))? `${(data[5].value/sum*100).toFixed(2)}%`:0
                    }                                            
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
            routerGo() {
                this.$router.push({ path: '/errordetail', query:{date: '5s'}});
            },	            
            //导出数据
            exportData () {
                this.$refs.table.exportCsv({
                    filename: '下发响应时常分布'
                });
            },            
        }
    }
</script>