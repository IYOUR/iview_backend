<style scoped>
.parkingTimes .headTitle{
    height: 60px;
    line-height: 60px;
    text-align: center;
}
.parkingTimes .hint{
    height: 40px;
    text-align: center;
}
.hint button{
    width: 130px;
}
.parkingTable{
    padding: 15px;
    margin-top: 30px;
}
.datePicker{
    width: 130px;
    margin:0 auto;
}
</style>
<template>
    <Tabs type="card">
        <Tab-pane :label="item.label" v-for="(item,idx) in realTimeTabs.tabOption" :key="idx" class="parkingTimes">
             <Row>
                <Col span="5">
                    <div class="headTitle"><span>{{item.label}}</span></div>
                </Col>
                <Col span="5" offset="14">
                    <div class="hint">
                        <Tooltip :transfer="Boolean(1)" placement="left">
                            <Button><Icon type="ios-help-outline"></Icon>指标定义</Button>
                            <div style="white-space: normal" slot="content">
                                <span>{{item.hint}}</span>
                            </div>
                        </Tooltip>    
                    </div>
                    <div class="hint">
                        <Date-picker class="datePicker" v-model="queryDate" :options="disableDate" placement="bottom-end" placeholder="选择日期"></Date-picker> 
                    </div>
                </Col>
            </Row>
            <div :id="item.id" style="width:100%; height:400px;"></div>       
        </Tab-pane>
    </Tabs>
</template>
<script>
    import echarts from 'echarts';
    import {mapState, mapActions, mapGetters} from 'vuex';
    import DateFormat from '../../../../commons/utils/formatDate.js';
    import * as situationService from '../../../../api/situation';
    import CONSTANT from '../../../../commons/utils/code';
    export default {
        data (){
            return {
				disableDate: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }					
				},
                dateClearable: false,                  
                queryDate: '',
                chartLine: {
                    currentIns:{val:null,data:['date','ins'],name:'实时进车次数'},
                    currentOuts:{val:null,data:['date','outs'],name:'实时出车次数'},
                    currentInparks:{val:null,data:['date','in_parks'],name:'实时停放数放量'},
                    currentRatio:{val:null,data:['date','space_ratio'],name:'实时车位使用率(%)'},
                    currentCharge:{val:null,data:['date','charge'],name:'实时收入'},
                    currentAdd:{val:null,data:['date','new'],name:'实时新增车辆数'}
                },
            }
        },  
        computed: {
            ...mapState({
                currentResult: 'currentResult',
                realTimeTabs: 'realTimeTabs',
                queryParam: 'queryParam'
            }),	               
        },    
        mounted:function(){
            for (let item in this.chartLine){
                this.chartLine[item].val = echarts.init(document.getElementById([item]));     
                this.chartLine[item].val.showLoading();           
            }
        },
        watch:{
            'currentResult':{
                deep:true,
                handler:function(newVal,oldVal){
                    this.createCharts(this.currentResult.allResult.toDay);
                },     
            },
            'currentResult.dateResult':{
                deep:true,
                handler:function(newVal,oldVal){
                    this.createCharts(this.currentResult.dateResult);
                },    
            },            
            'queryDate':function(newVal,oldVal){
                let params = {
                    url: this.queryParam.toDay.url,
                    param: {
                        date: DateFormat.format(newVal, 'yyyy-MM-dd')
                    }
                }
                setTimeout(()=>{
                    this.$store.dispatch('getDateResult',params); 
                },300)
            },
            'queryParam':{
                deep:true,
                handler:function(newVal,oldVal){
                    this.queryDate = '';
                },     
            },                       
        },        
        methods: {
            createCharts(res) {
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
                            axisLabel:{
                                interval:0,
                                 rotate:45,
                            },
                            boundaryGap: false,
                            data: this.filterChartData(['date','date'],res)
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [
                            {
                                name:this.chartLine[item].name,
                                type:'line',
                                stack: '总量',
                                data:this.filterChartData(this.chartLine[item].data,res)
                            }
                        ]
                    });
                }
            },
            filterChartData(item,res) {
                let chartLine = Object.assign({}, res)

                return chartLine.data.map((ele)=> {
                    switch (item[1]) {
 						case 'charge':
                            return Math.round(ele.charge/100);
							break;   
 						case 'eachCarPay':
                            return (ele.charge/ele.dedup_finish/100).toFixed(2);
							break;  
 						case 'eachTimesPay':
                            return (ele.charge/ele.finish/100).toFixed(2);
							break; 
 						case 'space_ratio':
                            return (ele.space_ratio).toFixed(2);
							break;                             
 						case 'date':
                            return DateFormat.format(DateFormat.formatToDate (ele.date), 'hh:mm')
							break;                                                                                                            
                    }
                    return ele[item[1]];
                });
            },
			getDateResult(params) {
				return situationService.getQueryResult(params).then(res => {
                    if (res.status != CONSTANT.HTTP_STATUS.SUCCESS.CODE) {
                        this.$Message.error(res.message || CONSTANT.HTTP_STATUS.SERVER_ERROR.MSG);
                        return;
                    }; 
                    this.createCharts(res.data);
				});
			},	             
        }
    }
</script>