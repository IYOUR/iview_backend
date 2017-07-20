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
        <Tab-pane :label="item.label" v-for="(item,idx) in paymentDetailTabs.tabOption" :key="idx" class="parkingTimes">
             <Row>
                <Col span="5">
                    <div class="headTitle"><span>{{item.label}}</span></div>
                </Col>
                <Col span="5" offset="14">
                    <div class="hint">
                        <Tooltip placement="left">
                            <Button><Icon type="ios-help-outline"></Icon>指标定义</Button>
                            <div style="white-space: normal" slot="content">
                                <span>{{item.hint}}</span>
                            </div>
                        </Tooltip>       
                    </div>
                    <Date-picker v-if="datePicker" class="datePicker" type="date" placement="bottom-end" placeholder="选择日期"></Date-picker> 
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
                    charge:{val:null,data:['date','charge'],name:'总收入(元)'},
                    eachTimesPay:{val:null,data:['date','eachTimesPay'],name:'平均每次付费(元)'},
                    eachCarPay:{val:null,data:['date','eachCarPay'],name:'平均每车付费(元)'},
                    // notPay:{val:null,data:['date','notPay'],name:'未支付用户比'},
                    spaceWorth:{val:null,data:['date','spaceWorth'],name:'车位平均价值(元)'}
                },
            }
        },  
        computed: {
            datePicker: function() {
                return this.$route.path==='/realTimeData'?true:false;
            },
            ...mapState({
                paymentDetailData: 'paymentDetailData',
                paymentDetailTabs: 'paymentDetailTabs'
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
                    if(newVal.length===0){
                        this.$Message.warning('暂无数据！');
                        return
                    }                    
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
                            data:[this.chartLine[item].name]
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
                            data: this.filterChartData(['date','date'])
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [
                            {
                                name:this.chartLine[item].name,
                                type:'line',
                                stack: '总量',
                                data:this.filterChartData(this.chartLine[item].data)
                            }
                        ]
                    });
                }
            },
            filterChartData(item) {
                let chartLine = Object.assign([], this.paymentDetailData.tableSection)

                return chartLine.map((ele)=> {
                    switch (item[1]) {
 						case 'charge':
                            return this.isInvaild(ele.charge/100);
							break;   
 						case 'eachCarPay':
                            return this.isInvaild(ele.charge/ele.dedup_finish/100);
							break;  
 						case 'eachTimesPay':
                            return this.isInvaild(ele.charge/ele.finish/100);
							break;   
 						case 'spaceWorth':
                            return this.isInvaild(ele.charge/ele.space/100);
							break;                                                       
 						case 'date':
                            return ele.date;
							break;                                                                                                            
                    }
                    return ele[item[1]];
                });
            },
            isInvaild(val) {
                if(!isFinite(val) || !val) {
                    return "0.00"
                }
                return val.toFixed(2)
            }             
        }
    }
</script>