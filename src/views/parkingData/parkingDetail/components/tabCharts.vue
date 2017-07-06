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
        <Tab-pane :label="item.label" v-for="(item,idx) in parkDetailTabs.tabOption" :key="idx" class="parkingTimes">
             <Row>
                <Col span="5">
                    <div class="headTitle"><span>{{item.label}}</span></div>
                </Col>
                <Col span="5" offset="14">
                    <div class="hint">
                        <Poptip trigger="hover" title="item.label" :content="item.hint"  placement="left">
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
    import DateFormat from '../../../../commons/utils/formatDate.js';
    export default {
        data (){
            return {
                chartLine: {
                    dedup_ins:{val:null,data:['date','dedup_ins'],name:'进场车数量'},
                    ins:{val:null,data:['date','ins'],name:'进场车次数'},
                    dedup_outs:{val:null,data:['date','dedup_outs'],name:'出场车数量'},
                    outs:{val:null,data:['date','outs'],name:'出场车次数'},
                    pass_nights:{val:null,data:['date','pass_nights'],name:'过夜车数量'},
                    space_ratio:{val:null,data:['date','space_ratio'],name:'车位使用率(%)'},
                    parking_duration:{val:null,data:['date','parking_duration'],name:'平均停车时长(分钟)'},
                    outsHour:{val:null,data:['date','outsHour'],name:'单位小时进出车辆数'},
                    increased:{val:null,data:['date','new'],name:'新增车辆数'}
                },
            }
        },  
        computed: {
            datePicker: function() {
                return this.$route.path==='/realTimeData'?true:false;
            },
            ...mapState({
                parkDetailData: 'parkDetailData',
                parkDetailTabs: 'parkDetailTabs'
            }),	               
        }, 
        mounted:function(){
            for (let item in this.chartLine){
                this.chartLine[item].val = echarts.init(document.getElementById([item]));     
                this.chartLine[item].val.showLoading();           
            }
        },        
        watch:{
            'parkDetailData':{
                deep:true,
                handler:function(newVal,oldVal){
                    if(newVal.length===0){
                        this.$Message.warning('暂无数据！');
                        return
                    }
                    this.createCharts()
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
                let chartLine = Object.assign([], this.parkDetailData.tableSection) 
                return chartLine.map((ele)=> {
                    switch (item[1]) {
 						case 'charge':
                            return (ele.charge/100).toFixed(2);
							break;   
 						case 'outsHour':
                            return ((ele.dedup_outs+ele.dedup_ins)/24).toFixed(2);
							break;  
 						case 'increased':
                            return ele.ins;
							break; 
 						case 'date':
                            return DateFormat.format(DateFormat.formatToDate (ele.date), 'yyyy-MM-dd');
							break;    
 						case 'parking_duration': 
                            return this.isInvaild(ele.parking_duration/ele.finish/60)
							break;       
 						case 'space_ratio':
                            return (ele.space_ratio).toFixed(2);
							break;                                                                                                                                                             
                    }
                    return ele[item[1]];
                });
            },
            isInvaild(val) {
                if(!isFinite(val)) {
                    return '0'
                }
                return val.toFixed(2)
            }                
        }
    }
</script>