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
                            title: '下发总次数',
                            key: 'total'
                        },
                        {
                            title: '下发成功次数',
                            key: 'success'
                        },
                        {
                            title: '下发失败次数',
                            key: 'fail' 
                        },
                        {
                            title: '下发超时次数',
                            key: 'timeOut' 
                        },                        
                        {
                            title: '失败详情查询',
                            key: 'failDetail',
                            align: 'center',
                            render: (h, params) => {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'ghost',
                                        },
                                        style: {
                                            width:'100px',
                                        },
                                        on: {
                                            click: () => {
                                                this.routerGo(params.row.date)
                                            }
                                        }
                                    }, '查询'),
                                ]);
                            }
                                                     
                        }	                        										
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
                networkResultData: 'networkResultData',
                queryParam: 'queryParam'
            }),	               
        },    
        mounted:function(){
            this.chartLine = echarts.init(document.getElementById('rangeChart'));
            this.chartLine.showLoading();  
        },
        watch:{
            'networkResultData.rangeData':{
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
                    this.$store.dispatch('getNetworkResult',params); 
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
                        data:['下发失败次数','下发成功次数','下发总次数']
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
                            name:'下发失败次数',
                            type:'line',
                            stack: '总量1',
                            data:this.filterChartData('fail',res)
                        },
                        {
                            name:'下发成功次数',
                            type:'line',
                            stack: '总量2',
                            data:this.filterChartData('success',res)
                        },
                        {
                            name:'下发总次数',
                            type:'line',
                            stack: '总量3',
                            data:this.filterChartData('total',res)
                        },
                    ]
                });
            },
            filterChartData(type,res) {
                let chartLine = Object.assign([], res);
                return chartLine.map((ele)=> {
                    switch (type) {
 						case 'fail':
                            return ele.fail;
							break;   
 						case 'success':
                            return ele.success;
							break;  
 						case 'total':
                            return ele.fail+ele.success;
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
                    filename: `${this.csvName}(${this.exportDate()})`
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
                        total:tableShowData[i].fail+tableShowData[i].success+tableShowData[i].timeout,
                        success:tableShowData[i].success,
                        fail:tableShowData[i].fail,
                        timeOut:tableShowData[i].timeout,
                    }
                    rowData.push(raw);
                }
                this.tableData.data = rowData;
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
            routerGo(param) {
                this.$router.push({ path: '/errordetail', query:{date: param}});
            }	             
        }
    }
</script>