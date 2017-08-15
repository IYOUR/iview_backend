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
                            title: '金额(元)',
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
                paymentDetailData: 'paymentDetailData'
            }),                          
        },
        mounted:function(){
            this.chartPie = echarts.init(document.getElementById('payWayPie'));
            this.chartPie.showLoading(); 
        },         
        watch:{
            'paymentDetailData':{
                deep:true,
                handler:function(newVal,oldVal){
                    if(newVal.paySection == null){
                        newVal.paySection = [];
                    }          
                    this.creatPie(newVal.paySection);
                    this.showTableData(newVal.paySection);
                },
            }
        },                 
        methods: {
            creatPie(res) {
                this.chartPie.hideLoading(); 
                this.chartPie.setOption({
                    title : {
                        text: '支付渠道金额分布',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['停车王钱包','支付宝','微信','现金','银联','其他']
                    },
                    series : [
                        {
                            name: '支付渠道金额分布(元)',
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
                //计算校验
                let isInvaild = function (val) {
                    if(!isFinite(val)) {
                        return 0.00
                    }
                    return (val/100).toFixed(2)
                }  
                let pieData = [
                    {value:isInvaild(add(extract('wallet',res))), name:'停车王钱包'},
                    {value:isInvaild(add(extract('alipay',res))), name:'支付宝'},
                    {value:isInvaild(add(extract('weixin',res))), name:'微信'},
                    {value:isInvaild(add(extract('cash',res))), name:'现金'},
                    {value:isInvaild(add(extract('uniopay',res))), name:'银联'},
                    {value:isInvaild(add(extract('unkown',res))), name:'其他'}
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
                        type: '停车王钱包',
                        money: `￥${(data[0].value)}`,
                        ratio : (!isNaN(data[0].value/sum))? `${(data[0].value/sum*100).toFixed(2)}%`:0
                    },
                    {
                        type: '支付宝',
                        money: `￥${(data[1].value)}`,
                        ratio : (!isNaN(data[1].value/sum))? `${(data[1].value/sum*100).toFixed(2)}%`:0
                    },
                    {
                        type: '微信',
                        money: `￥${(data[2].value)}`,
                        ratio : (!isNaN(data[2].value/sum))? `${(data[2].value/sum*100).toFixed(2)}%`:0
                    },
                    {
                        type: '现金',
                        money: `￥${(data[3].value)}`,
                        ratio : (!isNaN(data[3].value/sum))? `${(data[3].value/sum*100).toFixed(2)}%`:0
                    },
                    {
                        type: '银联',
                        money: `￥${(data[4].value)}`,
                        ratio : (!isNaN(data[4].value/sum))? `${(data[4].value/sum*100).toFixed(2)}%`:0
                    },   
                    {
                        type: '其他',
                        money: `￥${(data[5].value)}`,
                        ratio : (!isNaN(data[5].value/sum))? `${(data[5].value/sum*100).toFixed(2)}%`:0
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
                    filename: '支付渠道金额'
                });
            },            
        }
    }
</script>