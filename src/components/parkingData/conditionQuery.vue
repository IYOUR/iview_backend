<style scoped>
    .layout-content-filtrate{
		padding: 15px;
		margin-bottom: -20px;
    }
    .filtrate-title{
		text-align: center;
		font-size: 14px;
	}
	.currentDate{
		text-align: center;
		font-size: 1.5vw;
    	font-weight: bold;
	}
</style>
<template>
	<div class="layout-content-filtrate">
		<Form :model="queryParam" label-position="right" :label-width="100">
			<row>
				<Col span="2" class="filtrate-title">
					<span>条件选择:</span>
				</col>
				<Col span="7">
					<Form-item label="省份:">
						<Select v-model="queryParam.province" @on-change="selectProvince" clearable placeholder="请选择">
							<Option v-for="item in provinceList" :value="item.value" :key="item">{{ item.label }}</Option>
						</Select>
					</Form-item>
					<Form-item label="停车场:">
						<Select v-model="queryParam.park_code" clearable placeholder="请选择">
							<Option v-for="item in parkList" :value="item.value" :key="item">{{ item.label }}</Option>
						</Select>
					</Form-item>
				</col>
				<Col span="7">
					<Form-item label="城市:">
						<Select v-model="queryParam.city" @on-change="selectCity" clearable placeholder="请选择">
							<Option v-for="item in cityList" :value="item.value" :key="item">{{ item.label }}</Option>
						</Select>
					</Form-item>
					<Form-item label="选择日期:">
						<Date-picker v-model="queryParam.date" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="开始时间 - 结束时间 "></Date-picker>
					</Form-item>								
				</col>
				<Col span="7">			
					<Form-item label="集团:">
						<Select v-model="queryParam.company" clearable placeholder="请选择">
							<Option v-for="item in companyList" :value="item.value" :key="item">{{ item.label }}</Option>
						</Select>
					</Form-item>
					<Form-item>
						<row :gutter="16">
							<Col span="12">
								<Button @click="query" type="primary" style="width:100%;">查询</Button>
							</Col>
							<Col span="12">
								<Button @click="reset" type="ghost"  style="width:100%;">重置</Button>
							</Col>
						</row>	
					</Form-item>			
				</col>
			</row>	
		</Form>
	</div>
</template>
<script>
    import * as situationService from '../../api/situation';
	import CONSTANT from '../../commons/utils/code';
	import DateFormat from '../../commons/utils/formatDate.js';
	import {mapState, mapActions, mapGetters} from 'vuex';
	import axios from 'axios';
    export default {
		data() {
			return {
				queryParam: {
					province: '',
					park_code: '',
					city: '',
					date: [],
					company: ''
				},
				provinceList: [],
                cityList: [],
				companyList: [],
				parkList: [],
				resultData: {}
			}
		},
		computed: {
			datePicker: function() {
				return this.$route.path==='/realTimeData'?true:false;
			}
		},
        created () {
            this.getProvinceList();
			this.getCompanyList();
			this.getParkList();
			//this.sendEachQuery();	
			//this.$store.dispatch('getProvinceList');
			
        },
		methods: {
			selectProvince(value) {
				this.getCityList({leveltype:'2',parent:value});
				this.getParkList({province:value})	
			},		
			selectCity(value) {
				if(value == ''){
					this.getParkList({province:this.queryParam.province});	
					return
				}
				this.getParkList({city:value})		
			},				
			//点击查询
			query() {
				this.sendEachQuery();
				
			},
			//点击重置
            reset () {
				this.queryParam = {
					province: '',
					park_code: '',
					city: '',
					date: [],
					company: ''
				}
            },
            //参数处理
            paramsProcess(type){
                let queryParam = Object.assign({}, this.queryParam), request = {url:'',param:{}},queryDate;
				if (queryParam.date.length === 0 || queryParam.date[0] === null) {
					request.url = 'province/0/range';
					switch (type) {
						case 'defaultDay':
							request.param.sdate = DateFormat.format(DateFormat.addDay(new Date(), -1), 'yyyy-MM-dd');
							request.param.edate = DateFormat.format(DateFormat.addDay(new Date(), -1), 'yyyy-MM-dd');
							break;
						case 'lastDay':
							request.param.sdate = DateFormat.format(DateFormat.addDay(new Date(), -2), 'yyyy-MM-dd');
							request.param.edate = DateFormat.format(DateFormat.addDay(new Date(), -2), 'yyyy-MM-dd');
							break;
						case 'lastWeek':
							request.param.sdate = DateFormat.format(DateFormat.addDay(new Date(), -8), 'yyyy-MM-dd');
							request.param.edate = DateFormat.format(DateFormat.addDay(new Date(), -8), 'yyyy-MM-dd');
							break;
						case 'lastMonth':
							request.param.sdate = DateFormat.format(DateFormat.addMonth(new Date(), -1), 'yyyy-MM-dd');
							request.param.edate = DateFormat.format(DateFormat.addMonth(new Date(), -1), 'yyyy-MM-dd');
							break;
						//过去的一周时间内	
						case 'pastWeek':
							request.param.sdate = DateFormat.format(DateFormat.addDay(new Date(), -7), 'yyyy-MM-dd');
							request.param.edate = DateFormat.format(DateFormat.addDay(new Date(), -1), 'yyyy-MM-dd');
							break;							
					}						
				} 
				else {	
					request.url = 'province/0/range';	
					switch (type) {
						case 'defaultDay':
							request.param.sdate = DateFormat.changeDate(queryParam.date[0]);
							request.param.edate = DateFormat.changeDate(queryParam.date[1]);
							break;
						case 'lastDay':
							request.param.sdate = DateFormat.changeDate(DateFormat.addDayStr(DateFormat.changeDate(queryParam.date[0]),-1));
							request.param.edate = DateFormat.changeDate(DateFormat.addDayStr(DateFormat.changeDate(queryParam.date[1]),-1));
							break;
						case 'lastWeek':
							request.param.sdate = DateFormat.changeDate(DateFormat.addDayStr(DateFormat.changeDate(queryParam.date[0]),-7));
							request.param.edate = DateFormat.changeDate(DateFormat.addDayStr(DateFormat.changeDate(queryParam.date[1]),-7));
							break;
						case 'lastMonth':
							request.param.sdate = DateFormat.changeDate(DateFormat.addMonthStr(DateFormat.changeDate(queryParam.date[0]),-1));
							request.param.edate = DateFormat.changeDate(DateFormat.addMonthStr(DateFormat.changeDate(queryParam.date[1]),-1));
							break;
						//过去的一周时间内	
						case 'pastWeek':
							request.param.sdate = DateFormat.changeDate(queryParam.date[0]);
							request.param.edate = DateFormat.changeDate(queryParam.date[1]);
							break;								
					}								
				}	
				if (queryParam.park_code.length !== 0) {
					request.url = `park/${queryParam.park_code}/range`;
					return request;
				}
				if (queryParam.company.length !== 0) {
					request.url = `company/${queryParam.company}/range`;
					return request;
				}
				if (queryParam.city.length !== 0) {
					request.url = `city/${queryParam.city}/range`;
					return request;
				}
				if (queryParam.province.length !== 0) {
					request.url = `province/${queryParam.province}/range`;
					return request;
				}
                return request;
            },
			//发送各个查询条件
			sendEachQuery(){
				axios.all([
					this.getQueryResult({name: 'defaultDay',val:this.paramsProcess('defaultDay')}), 
					this.getQueryResult({name: 'lastDay',val:this.paramsProcess('lastDay')}),
					this.getQueryResult({name: 'lastWeek',val:this.paramsProcess('lastWeek')}),
					this.getQueryResult({name: 'lastMonth',val:this.paramsProcess('lastMonth')}),
					this.getQueryResult({name: 'pastWeek',val:this.paramsProcess('pastWeek')})
				]).then(axios.spread((acct, perms) => {
					this.$emit('queryResult',Object.assign({}, perms));
				}));
			},
			//获取查询结果
            getQueryResult(searchParam) {
            	return situationService.getQueryResult(searchParam.val).then(res => {
                    if (res.status != CONSTANT.HTTP_STATUS.SUCCESS.CODE) {
                        this.$Message.error(res.message || CONSTANT.HTTP_STATUS.SERVER_ERROR.MSG);
                        return;
                    };
					this.resultData[searchParam.name] = res.data;
					return this.resultData;
                });
            },
			// //获取图表相关数据
            // getChartsData(searchParam) {
            // 	return situationService.getQueryResult(searchParam).then(res => {
            //         if (res.status != CONSTANT.HTTP_STATUS.SUCCESS.CODE) {
            //             this.$Message.error(res.message || CONSTANT.HTTP_STATUS.SERVER_ERROR.MSG);
            //             return;
            //         };
			// 		console.log(res.data)
			// 		this.$emit('chartsData',res.data);
            //     });
            // },					
			//获取集团列表
            getCompanyList() {
                return situationService.getCompanyList().then(res => {
                    if (res.status != CONSTANT.HTTP_STATUS.SUCCESS.CODE) {
                        this.$Message.error(res.message || CONSTANT.HTTP_STATUS.SERVER_ERROR.MSG);
                        return;
                    }; 
					this.companyList = res.data.data;
                });
            },	
			//获取省份列表			
            getProvinceList() {
                return situationService.getProvinceList().then(res => {
                    if (res.status != CONSTANT.HTTP_STATUS.SUCCESS.CODE) {
                        this.$Message.error(res.message || CONSTANT.HTTP_STATUS.SERVER_ERROR.MSG);
                        return;
                    }; 
					this.provinceList = res.data.data;
                });
            },	
			//获取城市列表	
            getCityList(params) {
                return situationService.getCityList(params).then(res => {
                    if (res.status != CONSTANT.HTTP_STATUS.SUCCESS.CODE) {
                        this.$Message.error(res.message || CONSTANT.HTTP_STATUS.SERVER_ERROR.MSG);
                        return;
                    }; 
					this.cityList = res.data.data;
                });
            },	
			//获取车场列表	
            getParkList(params) {
                return situationService.getParkList(params).then(res => {
                    if (res.status != CONSTANT.HTTP_STATUS.SUCCESS.CODE) {
                        this.$Message.error(res.message || CONSTANT.HTTP_STATUS.SERVER_ERROR.MSG);
                        return;
                    }; 
					this.parkList = res.data.data;
                });
            },																						
		}

    }
</script>