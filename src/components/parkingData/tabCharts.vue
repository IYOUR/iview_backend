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
        <Tab-pane :label="item.label" v-for="(item,idx) in situationTabs.tabOption" :key="idx" class="parkingTimes">
             <Row>
                <Col span="5">
                    <div class="headTitle"><span>{{item.label}}</span></div>
                </Col>
                <Col span="5" offset="14">
                    <div class="hint">
                        <Poptip trigger="hover" title="item.label" :content="item.label"  placement="left">
                            <Button><Icon type="ios-help-outline"></Icon>指标定义</Button>
                        </Poptip>        
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
                    dedup_finish:{val:null,data:['date','dedup_finish'],name:'每日完成停车数量'},
                    finish:{val:null,data:['date','finish'],name:'每日完成停车次数'},
                    charge:{val:null,data:['date','charge'],name:'每日总收入(元)'},
                    averageCharge:{val:null,data:['date','eachCarPay'],name:'每日平均每辆车付费(元)'},
                    eachCharge:{val:null,data:['date','eachTimesPay'],name:'每日平均每次付费(元)'},
                    space:{val:null,data:['date','space'],name:'车位数量'},
                    parks:{val:null,data:['date','parks'],name:'停车场数量'}
                },
            }
        },  
        computed: {
            datePicker: function() {
                return this.$route.path==='/realTimeData'?true:false;
            },
            ...mapState({
                queryResult: 'queryResult',
                situationTabs: 'situationTabs'
            }),	               
        },    
        // mounted:function(){
        //     this.createCharts();
        // },
        watch:{
            'queryResult':{
                deep:true,
                handler:function(newVal,oldVal){
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
                    this.chartLine[item].val = echarts.init(document.getElementById([item]));
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
                let chartLine = Object.assign({}, this.queryResult.pastWeek)

                return chartLine.data.map((ele)=> {
                    switch (item[1]) {
 						case 'charge':
                            return (ele.charge/100).toFixed(2);
							break;   
 						case 'eachCarPay':
                            return (ele.charge/ele.dedup_finish/100).toFixed(2);
							break;  
 						case 'eachTimesPay':
                            return (ele.charge/ele.finish/100).toFixed(2);
							break; 
 						case 'date':
                            return ele.date;
							break;                                                                                                            
                    }
                    return ele[item[1]];
                });
            }
        }
    }
</script>