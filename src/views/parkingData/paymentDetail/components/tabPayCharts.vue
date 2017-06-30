<style scoped>
.parkingTimes .headTitle{
    height: 60px;
    line-height: 60px;
    text-align: center;
}
.parkingTimes .hint{
    height: 60px;
    line-height: 60px;
    text-align: center;
}
.hint button{
    width: 115px;
}
.parkingTable{
    padding: 15px;
    margin-top: 30px;
}
.datePicker{
    width: 115px;
    margin:0 auto;
}
</style>
<template>
    <Tabs type="card">
        <Tab-pane :label="item.label" v-for="(item,idx) in paymentWayTabs.tabOption" :key="idx" class="parkingTimes">
             <Row>
                <Col span="5">
                    <div class="headTitle"><span>{{item.label}}</span></div>
                </Col>

            </Row>
            <div :id="item.id" style="width:100%; height:400px;"></div>       
        </Tab-pane>
    </Tabs>
</template>
<script>
    import echarts from 'echarts';
    import {mapState, mapActions, mapGetters} from 'vuex';

    export default {
        data (){     
            return {
                chartLine: {
                    weixin:{val:null,data:['date','weixin'],name:['微信支付金额','微信支付次数']},
                    alipay:{val:null,data:['date','alipay'],name:['支付宝支付金额','支付宝支付次数']},
                    uniopay:{val:null,data:['date','uniopay'],name:['银联支付金额','银联支付次数']},
                    cash:{val:null,data:['date','cash'],name:['现金支付金额','现金支付次数']},
                    wallet:{val:null,data:['date','wallet'],name:['停车王钱包支付金额','停车王钱包支付次数']},
                    unkown:{val:null,data:['date','unkown'],name:['其他支付金额','其他支付次数']},
                },
            }
        },  
        computed: {
            datePicker: function() {
                return this.$route.path==='/realTimeData'?true:false;
            },
            ...mapState({
                paymentDetailData: 'paymentDetailData',
                paymentWayTabs: 'paymentWayTabs'
            }),	               
        },
        mounted:function(){
            for (let item in this.chartLine){
                this.chartLine[item].val = echarts.init(document.getElementById([item]));     
                this.chartLine[item].val.showLoading();           
            }
        },         
        watch:{
            'paymentDetailData':{
                deep:true,
                handler:function(newVal,oldVal){
                    // if(newVal.length===0){
                    //     this.$Message.warning('暂无数据！');
                    //     return
                    // }                 
                    this.createCharts();
                },
            }
        },        
        methods: {
            showCharts(name) {
                console.log("as")
            },
            createCharts() {
                for (let item in this.chartLine){
                    this.chartLine[item].val.hideLoading();  
                    this.chartLine[item].val.setOption({
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data:this.chartLine[item].name
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: this.filterChartData(['date','date'],'date')
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [
                            {
                                name:this.chartLine[item].name[0],
                                type:'line',
                                stack: this.chartLine[item].name[0],
                                data:this.filterChartData(this.chartLine[item].data,'money')
                            },
                            {
                                name:this.chartLine[item].name[1],
                                type:'line',
                                stack: this.chartLine[item].name[0],
                                data:this.filterChartData(this.chartLine[item].data,'times')
                            }                            
                        ]
                    });
                }
            },
            filterChartData(item,type) {
                let chartLine = Object.assign([], this.paymentDetailData.paySection)
                if(chartLine.length===0){
                    let data = chartLine = Object.assign([], this.paymentDetailData.tableSection)
                    return chartLine.map((ele)=> {
                        switch (type) {
                            case 'money':
                                return ele[item[1]] || 0;
                                break;   
                            case 'times':
                                return ele[`${item[1]}_s`] || 0;
                                break;   
                            case 'date':
                                return ele.date;
                                break;   
                            default:
                                return 0;                                                                                                                                    
                        }
                    });
                }
                else {
                    return chartLine.map((ele)=> {
                        switch (type) {
                            case 'money':
                                return ele[item[1]] || 0;
                                break;   
                            case 'times':
                                return ele[`${item[1]}_s`] || 0;
                                break;   
                            case 'date':
                                return ele.date;
                                break;   
                            default:
                                return 0;                                                                                                                                    
                        }
                    });
                }
            }
        }
    }
</script>