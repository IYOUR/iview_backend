<style scoped>
	.divisionLine{
		height: 15px;
		background-color: #f5f7f9;
		width: auto;
	}
	.layout-content-filtrate{
		padding: 15px;
		margin-bottom: -20px;
    }
	.layout-content-situation{
		padding: 15px 60px;
	}	
    .parkInfo p{
        line-height: 30px;
        font-size: 12px;
        color: #495060;
    }
    .parkInfo p span{
        margin-left: 5px;
    } 
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
    .datePicker{
        width: 180px;
        margin:0 auto;
        margin-right:50px;
    }
</style>
<template>
<div>
	<div class="layout-content-filtrate">
		<Form label-position="right" :label-width="100">
			<row>
				<Col span="7">
					<Form-item label="车场名称:">
                        <Select v-model="parkCode" filterable clearable placeholder="输入车场名称">
                            <Option v-for="item in parkList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>   
					</Form-item>	
				</col>

				<Col span="7">	
					<Form-item>
						<Button type="primary" @click="query" style="width:120px;">查询</Button>
					</Form-item>
				</col>
			</row>	
		</Form>
	</div>
	<div class="divisionLine"></div>
	<div class="layout-content-situation">
        <row>
            <Col span="24">
                <Card dis-hover>
                    <row>
                        <Col span="24"><p style="font-weight: bold;margin-bottom: 10px;">{{this.transformPark(parkInfo.park_code)}}</p></Col>
                    </row>
                    <row class="parkInfo">
                        <Col span="8">
                            <!--单独处理内容过长换行导致定格显示的问题-->
                            <div style="width:60px;float:left;">
                                <p>地理位置:</p>
                            </div>
                            <div style="width:calc(100% - 60px);float: left;">
                                <p>{{parkInfo.park_address}}</p>
                            </div>     
                                         
                            <p>坐标:<span>{{parkInfo.park_gps}}</span></p>
                            <p>停车总次数:<span>{{parkInfo.parking_total}}</span></p>
                            <p>服务车主数:<span>{{parkInfo.parking_vpl}}</span></p>                                                                                                                        	                            
                            <p>车场实力指数:<span>{{parkInfo.park_exp}}</span></p>
                            <p>业态:<span>{{this.transformType(parkInfo.park_type)}}</span></p>
                            <p>总收入:<span>{{this.isInvaild(parkInfo.pay_total/100)}}元</span></p>
                        </Col>
                        <Col span="8">
                            <p>所属集团:<span>{{this.transformGroup(parkInfo.cid)}}</span></p> 
                            <p>上线时间:<span>{{this.transformDate(parkInfo.create_time)}}</span></p>
                            <p>车位数:<span>{{parkInfo.space}}</span></p>
                            <p>固定车辆数:<span>{{parkInfo.parking_fixed}}</span></p>                                                                                                                        	                            
                            <p>在停车辆数:<span>{{parkInfo.in_park}}</span></p>
                            <p>是否开通在线支付:<span>{{parkInfo.support_online==1? '是':'否'}}</span></p> 
                            <p>是否开通优惠券:<span>{{parkInfo.support_ecoupon==1? '是':'否'}}</span></p>                                                  
                        </Col>
                        <Col span="8">
                            <p>是否开通车位商城:<span>{{parkInfo.support_mall==1? '是':'否'}}</span></p>
                            <p>授权车数量:<span>{{parkInfo.auth_car}}</span></p>
                            <p>服务省数:<span>{{parkInfo.parking_province}}</span></p>
                            <p>停车次数最多车牌:<span>{{parkInfo.parking_max_vpl}}</span></p>
                            <p>在线支付订单占比:<span>{{parkInfo.online_ratio}}%</span></p>
                        </Col>
                    </row>
                </Card>              
            </Col>            
        </row>
        <row style="margin-top:25px;">
            <Col span="24">
                <Card dis-hover :padding="10">
                    <Row class="parkingTimes">
                        <Col span="5">
                            <div class="headTitle"><span>车场实力变化趋势</span></div>
                        </Col>
                        <Col span="5" offset="14">
                            <div class="hint">
                                <Date-picker class="datePicker" v-model="queryDate" format="yyyy/MM/dd" type="daterange" :options="disableDate" placement="bottom-end" placeholder="选择日期"></Date-picker> 
                            </div>
                        </Col>
                    </Row>
                    <div id="rangeChart" style="width:100%; height:400px;"></div>                 
                </Card>
            </Col>
        </row>
	</div>
</div> 
</template>

<script>
import echarts from 'echarts';
import {getParkDetail,getParkExp} from '../../../api/situation';
import DateFormat from '../../../commons/utils/formatDate.js';

  export default {
    data () {
        return {
            disableDate: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now()-86400000;
                }					
            },    
            queryDate: [],        
            parkCode:'',
            table: {
                columns: [
                    {
                        title: '进场时间',
                        key: 'in_time'
                    },
                    {
                        title: '出场时间',
                        key: 'out_time'
                    },
                    {
                        title: '停车时长',
                        key: 'parking_duration'
                    },   
                    {
                        title: '停车费用',
                        key: 'parking_charge'
                    }, 
                    {
                        title: '停车场',
                        key: 'park'
                    }, 
                    {
                        title: '支付方式',
                        key: 'payWay'
                    }, 
                    {
                        title: '是否授权车',
                        key: 'is_auth'
                    },																																																                    
                ],
                data:[]                    
            },
            parkInfo: {
                park_code: '',
                park_address: '',
                park_gps: '',
                create_time: '',
                cid: '',
                park_type: '',
                in_park: '',
                space: '',
                park_exp: '',
                parking_total: '',
                parking_vpl: '',
                parking_fixed: '',
                parking_province: '',
                parking_max_vpl: '',
                pay_total: '',
                support_online: '',
                support_ecoupon: '',
                support_mall:'',
                auth_car:'',
                online_ratio:'',
            }
        }
    },
	computed: {
        companyList () {
		    return JSON.parse(sessionStorage.getItem('companyList')) || [];	
        },        
        parkList () {
		    return JSON.parse(sessionStorage.getItem('parkList')) || [];	
        },     
	},	
    watch:{
        'queryDate':function(newVal,oldVal){
            if(newVal.length===0)
                return
            let params = {
                code:(this.parkCode=='')? this.$route.query.num:this.parkCode,
                param:{
                    sdate: DateFormat.format(newVal[0], 'yyyy-MM-dd'),
                    edate: DateFormat.format(newVal[1], 'yyyy-MM-dd')                    
                },
            }
            this.getParkExp(params);
        },    
    },
	mounted () {
		if(this.$route.query.num){
            this.parkCode = this.$route.query.num;
            this.getParkDetail(this.$route.query.num);
            let params = {
                code:this.$route.query.num,
                param:{
                    edate: DateFormat.format(DateFormat.addDay(new Date(), -1), 'yyyy-MM-dd'),
                    sdate: DateFormat.format(DateFormat.addDay(new Date(), -8), 'yyyy-MM-dd')
                }
            }
            this.getParkExp(params);
		}

        this.chartLine = echarts.init(document.getElementById('rangeChart'));
        this.chartLine.showLoading();          
	},	     	    
    methods: {
        query () {
            if(this.parkCode.length==0){
                this.$Message.warning('请输入车场名称')
                return
            }
            this.getParkDetail(this.parkCode);
            let params = {
                code:this.parkCode,
                param:{
                    edate: DateFormat.format(DateFormat.addDay(new Date(), -1), 'yyyy-MM-dd'),
                    sdate: DateFormat.format(DateFormat.addDay(new Date(), -8), 'yyyy-MM-dd')
                }
            }
            this.queryDate = [];
            this.getParkExp(params);            
        },
        //获取详情
        getParkDetail (param) {
            return getParkDetail(param).then(res => {
                if(res.status ==200 && res.data.message=='ok'){
                    this.parkInfo = res.data.data
                    //this.handleTableData(res.data.data)
                } else{
                    this.$Message.error(res.data.message);
                }
            });
        },  
        //获取实力指数
        getParkExp (param) {
            return getParkExp(param).then(res => {
                if(res.status ==200 && res.data.message=='ok'){
                    this.createCharts(res.data.data)
                } else{
                    this.$Message.error(res.data.message);
                }
            });
        },          
        handleTableData(res) {
            let tableShowData = res.records.reverse(),rowData = [];
            for(let item in tableShowData) {
                let raw = {
                    in_time:this.transformDate(tableShowData[item].in_time),
                    out_time:this.transformDate(tableShowData[item].out_time),
                    parking_duration:this.formatSeconds(tableShowData[item].parking_duration),
                    parking_charge:`${this.isInvaild(tableShowData[item].parking_charge/100)}元`,
                    park:this.transform(tableShowData[item].park_code),
                    is_auth:tableShowData[item].is_auth==1? '是':'否',
                    payWay:this.transformPayWay(tableShowData[item].charge_type)
                }
                rowData.push(raw);
            }
            this.table.data = rowData;
        },    
        //将车场集团对应的code转换为名称
        transformGroup(code) {
            if(code.length==0){
                return ''
            }
            for(let j=0;j<this.companyList.length;j++) {
                if(this.companyList[j].value == code){
                    return this.companyList[j].label
                }
            }	
            return ''	
        },
        //将车场对应的code转换为名称
        transformPark(code) {
            if(code.length==0){
                return ''
            }
            for(let j=0;j<this.parkList.length;j++) {
                if(this.parkList[j].value == code){
                    return this.parkList[j].label
                }
            }	
            return ''	
        }, 
        transformType (code) {
            let dictionary = ['经营性','非经营性','道边车场','住宅','商场','写字楼','酒店','景点','商业综合体','办公园区','物流园','医院','车站','政府机关','剧院','学校','机场'];

            if(code==100){
                return '第三方对接车场'
            } 
            return dictionary[code]           
        },  
        isInvaild(val) {
            if(!isFinite(val)) {
                return ''
            }
            return val.toFixed(2)
            //Math.round(val)
        },
        //时间转换
        transformDate(date) {
            if(date.length==0 || date==0){
                return ''
            }
            return DateFormat.format(new Date(date*1000), 'yyyy-MM-dd hh:mm')	
        },                            
        createCharts(res) {
            this.chartLine.hideLoading();  
            this.chartLine.setOption({
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['车场实力指数']
                },
                grid: {
                    left: '3%',
                    right: '7%',
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
                    type: 'value',
                    scale: true
                },
                series: [
                    {
                        name:'车场实力指数',
                        type:'line',
                        stack: '总量1',
                        smooth: true,
                        data:this.filterChartData('exp',res),
                        markLine: {
                            symbol: "none",
                            label:{
                                normal: {
                                    show:true,
                                    position:'end',
                                    formatter:(()=>{
                                        let data = this.filterChartData('exp',res);
                                        if(Math.min(...data)==Math.max(...data)){
                                            return '{c}'
                                        }
                                        return '{c}\n({b})';
                                    })()
                                }
                            },                          
                            data: [
                                {type: 'average', name: '平均值',lineStyle:{normal:{color:'#FF7A5A'}}},
                                {type: 'min', name: '低位值',lineStyle:{normal:{color:'#32424A'}}},
                                {type: 'max', name: '高位值',lineStyle:{normal:{color:'#4586FF'}}}
                            ]
                        }      
                    },
                  
                ]
            });
        }, 
        filterChartData(type,res) {
            let chartLine = Object.assign([], res);
            return chartLine.map((ele)=> {
                switch (type) {
                    case 'exp':
                        return ele.exp;
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
    }
}
</script>
