<style scoped>
.parkingTimes .headTitle{
    height: 60px;
    line-height: 60px;
    text-align: center;
}
.parkingTimes .hint{
    height: 40px;
    line-height: 60px;
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
    width: 180px;
    margin:0 auto;
    margin-right:50px;
}
.tableButton{
    margin-top: 15px;
    margin-bottom: 15px;
}
</style>
<template>
    <div>
        <Row class="parkingTimes">
            <Col span="5">
                <div class="headTitle"><span></span></div>
            </Col>
            <Col span="5" offset="14">
                <div class="hint">
                    <Date-picker class="datePicker" v-model="queryDate" format="yyyy/MM/dd" type="daterange" :options="disableDate" placement="bottom-end" placeholder="选择日期"></Date-picker> 
                </div>
            </Col>
        </Row>
        <div id="rangeChart" style="width:100%; height:400px;"></div> 
        <!-- 表格 -->
		<Row class="tableButton">
			<Col span="2" offset="20">
				<Button type="ghost" @click="isHidden = !isHidden" v-if="isHidden">隐藏表格</Button>
                <Button type="ghost" @click="isHidden = !isHidden" v-if="!isHidden">显示表格</Button>
			</Col>
			<Col span="2">
				<Button type="primary" @click="exportData">导出CSV</Button>
			</Col>
		</Row>
		<Table v-show="isHidden" border :columns="tableData.columns" :data="tableData.data" ref="table"></Table>        
    </div>
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
                        return date && date.valueOf() > Date.now()-86400000;
                    }					
				},
                dateClearable: false,                  
                queryDate: [],
                chartLine: null,
                //表格相关
                isHidden: true,  
                tableData: {
                    columns: [
                        {
                            title: '时间',
                            key: 'date'
                        },
                        {
                            title: '支付请求总次数',
                            key: 'request_bill'
                        },
                        {
                            title: '返回账单成功总次数',
                            key: 'bill_success'
                        },
                        {
                            title: '返回账单失败总次数',
                            key: 'bill_fail' 
                        },	
                        {
                            title: '发起支付总次数',
                            key: 'request_pay' 
                        },      
                        {
                            title: '支付成功总次数',
                            key: 'pay_success' 
                        },   
                        {
                            title: '未支付成功总次数',
                            key: 'pay_fail' 
                        },                          										
                    ],
                    data: []
                },                    
            }
        },  
        computed: {
            csvName: function() {
                return this.$route.name;
            },            
            ...mapState({
                onlinePayData: 'onlinePayData',
                queryParam: 'queryParam'
            }),	            
        },    
        mounted:function(){
            this.chartLine = echarts.init(document.getElementById('rangeChart'));
            this.chartLine.showLoading();  
        },
        watch:{
            'onlinePayData.rangeData':{
                deep:true,
                handler:function(newVal,oldVal){
                    this.createCharts(newVal);
                    this.handleTableData(newVal);
                },     
            },           
            'queryDate':function(newVal,oldVal){
                if(newVal.length===0)
                    return;
                let params = {
                    value:{
                        url: this.queryParam.pastWeek.url.replace(/day/g,'range'),
                        param: {
                            sdate: DateFormat.format(newVal[0], 'yyyy-MM-dd'),
                            edate: DateFormat.format(newVal[1], 'yyyy-MM-dd'),
                        }                            
                    },
                    type:'range'
                }
                setTimeout(()=>{
                    this.$store.dispatch('getOnlinePay',params); 
                },300)  
            },    
            'queryParam':{
                deep:true,
                handler:function(newVal,oldVal){
                    this.queryDate = [];
                },     
            },                               
        },        
        methods: {
            createCharts(res) {
                this.chartLine.hideLoading();  
                this.chartLine.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['支付请求总次数','返回账单成功总次数','返回账单失败总次数','发起支付总次数','支付成功总次数','未支付成功总次数']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        // axisLabel:{
                        //     interval:0,
                        //         rotate:45,
                        // },
                        boundaryGap: false,
                        data: this.filterChartData('date',res)
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name:'支付请求总次数',
                            type:'line',
                            stack: '总量1',
                            data:this.filterChartData('request_bill',res)
                        },
                        {
                            name:'返回账单成功总次数',
                            type:'line',
                            stack: '总量2',
                            data:this.filterChartData('bill_success',res)
                        },
                        {
                            name:'返回账单失败总次数',
                            type:'line',
                            stack: '总量3',
                            data:this.filterChartData('bill_fail',res)
                        },
                        {
                            name:'发起支付总次数',
                            type:'line',
                            stack: '总量4',
                            data:this.filterChartData('request_pay',res)
                        },
                        {
                            name:'支付成功总次数',
                            type:'line',
                            stack: '总量5',
                            data:this.filterChartData('pay_success',res)
                        },
                        {
                            name:'未支付成功总次数',
                            type:'line',
                            stack: '总量6',
                            data:this.filterChartData('pay_fail',res)
                        },   
                    ]
                });
            },
            filterChartData(type,res) {
                let chartLine = Object.assign([], res);
                return chartLine.map((ele)=> {
                    switch (type) {
 						case 'request_bill':
                            return ele.request_bill;
							break;   
 						case 'bill_success':
                            return ele.bill_success;
							break;  
 						case 'bill_fail':
                            return ele.bill_fail;
							break;                             
 						case 'request_pay':
                            return ele.request_pay
							break; 
 						case 'pay_success':
                            return ele.pay_success
							break;   
 						case 'pay_fail':
                            return ele.pay_fail
							break;                           
 						case 'date':
                            return ele.ctime
							break;                                                                                                            
                    }
                });
            },
            //导出数据
            exportData () {
                this.$refs.table.exportCsv({
                    filename: `${this.csvName}`
                });
            },
            //导出时间
            exportDate () {
                let date = DateFormat.format(DateFormat.formatToDate(this.queryParam.toDay.param.date), 'MM-dd')
                return `${date}`;
            },
            handleTableData(res) {
                let tableShowData = Object.assign([], res),rowData = [];
                for(let i=0;i<tableShowData.length;i++) {
                    let raw = {
                        date:tableShowData[i].ctime,
                        request_bill:tableShowData[i].request_bill,
                        bill_success:tableShowData[i].bill_success,
                        bill_fail:tableShowData[i].bill_fail,
                        request_pay:tableShowData[i].request_pay,
                        pay_success:tableShowData[i].pay_success,
                        pay_fail:tableShowData[i].pay_fail,
                    }
                    rowData.push(raw);
                }
                this.tableData.data = rowData;
            },             
        }
    }
</script>