<style scoped>

</style>
<template>
    <Tabs type="card">
        <Tab-pane label="图表">
            <div id="retryTimesPie" style="width:100%; height:400px;"></div>
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
                networkResultData: 'networkResultData',
            }),                          
        },
        mounted:function(){
            this.chartPie = echarts.init(document.getElementById('retryTimesPie'));
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
                        text: '下发失败重试成功次数分布',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    // color:['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3','#f1ae48'],
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['1次','2次','3次','4次','5次','6次','7次','8次','9次','10次','11次']
                    },
                    series : [
                        {
                            name: '重试成功次数分布',
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
                        {value:add(extract('retry_1',res)), name:'1次'},
                        {value:add(extract('retry_2',res)), name:'2次'},
                        {value:add(extract('retry_3',res)), name:'3次'},
                        {value:add(extract('retry_4',res)), name:'4次'},
                        {value:add(extract('retry_5',res)), name:'5次'},
                        {value:add(extract('retry_6',res)), name:'6次'},
                        {value:add(extract('retry_7',res)), name:'7次'},
                        {value:add(extract('retry_8',res)), name:'8次'},
                        {value:add(extract('retry_9',res)), name:'9次'},
                        {value:add(extract('retry_10',res)), name:'10次'},
                        {value:add(extract('retry_11',res)), name:'11次'},                      
                       ];
            },
            showTableData(res) {
                let data = this.handlePieData(res),arr=[];
                for(let i=0;i<data.length;i++){
                    arr.push(data[i].value)
                }
                let sum = this.getSum(arr)
                this.tableShowData.data =[  
                    {
                        type: '1次',
                        money: data[0].value,
                        ratio : (!isNaN(data[0].value/sum))? `${(data[0].value/sum*100).toFixed(2)}%`:0
                    },
                    {
                        type: '2次',
                        money: data[1].value,
                        ratio : (!isNaN(data[1].value/sum))? `${(data[1].value/sum*100).toFixed(2)}%`:0
                    },
                    {
                        type: '3次',
                        money: data[2].value,
                        ratio : (!isNaN(data[2].value/sum))? `${(data[2].value/sum*100).toFixed(2)}%`:0
                    },
                    {
                        type: '4次',
                        money: data[3].value,
                        ratio : (!isNaN(data[3].value/sum))? `${(data[3].value/sum*100).toFixed(2)}%`:0
                    },
                    {
                        type: '5次',
                        money: data[4].value,
                        ratio : (!isNaN(data[4].value/sum))? `${(data[4].value/sum*100).toFixed(2)}%`:0
                    },
                    {
                        type: '6次',
                        money: data[5].value,
                        ratio : (!isNaN(data[5].value/sum))? `${(data[5].value/sum*100).toFixed(2)}%`:0
                    },
                    {
                        type: '7次',
                        money: data[6].value,
                        ratio : (!isNaN(data[6].value/sum))? `${(data[6].value/sum*100).toFixed(2)}%`:0
                    },
                    {
                        type: '8次',
                        money: data[7].value,
                        ratio : (!isNaN(data[7].value/sum))? `${(data[7].value/sum*100).toFixed(2)}%`:0
                    },
                    {
                        type: '9次',
                        money: data[8].value,
                        ratio : (!isNaN(data[8].value/sum))? `${(data[8].value/sum*100).toFixed(2)}%`:0
                    },
                    {
                        type: '10次',
                        money: data[9].value,
                        ratio : (!isNaN(data[9].value/sum))? `${(data[9].value/sum*100).toFixed(2)}%`:0
                    },
                    {
                        type: '11次',
                        money: data[10].value,
                        ratio : (!isNaN(data[10].value/sum))? `${(data[10].value/sum*100).toFixed(2)}%`:0
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
            //导出数据
            exportData () {
                this.$refs.table.exportCsv({
                    filename: '下发失败重试成功次数分布'
                });
            },            
        }
    }
</script>