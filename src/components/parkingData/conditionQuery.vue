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
						<Select v-model="queryParam.province" on-change="selectProvince(value)" placeholder="请选择">
							<Option v-for="item in provinceList" :value="item.value" :key="item">{{ item.label }}</Option>
						</Select>
					</Form-item>
					<Form-item label="停车场:">
						<Select v-model="queryParam.park_code" placeholder="请选择">
							<Option v-for="item in cityList" :value="item.value" :key="item">{{ item.label }}</Option>
						</Select>
					</Form-item>
				</col>
				<Col span="7">
					<Form-item label="城市:">
						<Select v-model="queryParam.city" placeholder="请选择">
							<Option v-for="item in cityList" :value="item.value" :key="item">{{ item.label }}</Option>
						</Select>
					</Form-item>
					<Form-item label="选择日期:">
						<Date-picker v-model="queryParam.date" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="开始时间 - 结束时间 "></Date-picker>
					</Form-item>								
				</col>
				<Col span="7">			
					<Form-item label="集团:">
						<Select v-model="queryParam.company" placeholder="请选择">
							<Option v-for="item in cityList" :value="item.value" :key="item">{{ item.label }}</Option>
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
				searchParam: {
                    page: 1,
                    expire_time: [],
                    username: '',
                },
				customSearchParam: {
                    vpl: '',
                    pay_time: [],
                    park_code_list: [],
                    channel: -1,
                    card_id: -1,
                },
			}
		},
		computed: {
			// ...mapState({
            //     provinceList: 'cardConfigs',
            //     companyList: 'companyList',
            // }),
			datePicker: function() {
				return this.$route.path==='/realTimeData'?true:false;
			}
		},
        created () {
			//console.log(this.getQueryResult(this.paramsProcess('defaultDay')))
			//this.handleResult();
            this.getProvinceList()	
			
        },	
		watch: {


		},	
		methods: {
            // ...mapActions({
            //     getProvinceList: 'getProvinceList',
			// 	getCompanyList: 'getCompanyList'
            // }),	
			selectProvince() {
				console.log("pr")
			},		
			//点击查询
			query() {
				console.log(this.handleResult());
				//console.log(this.getQueryResult(this.paramsProcess('defaultDay')))
				//this.getQueryResult(this.paramsProcess());
				//console.log(DateFormat.format(DateFormat.addMonth(new Date(), -1), 'yyyy-MM-dd'))
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
			//格式化日期
            changeDate(now){
                let year = now.getFullYear();
                let month = now.getMonth() + 1;
                let date = now.getDate();
		        if (month >= 1 && month <= 9) {
					month = "0" + month;
				}
				if (date >= 0 && date <= 9) {
					date = "0" + date;
				}		
                return year + "-" + month + "-" + date;
            },		
            //参数处理
            paramsProcess(type){
                let queryParam = Object.assign({}, this.queryParam), request = {url:'',param:{}},queryDate;
				if (queryParam.date.length === 0 || queryParam.date[0] === null) {
					request.url = 'province/0/day';
					switch (type) {
						case 'defaultDay':
							request.param.date = DateFormat.format(DateFormat.addDay(new Date(), -1), 'yyyy-MM-dd');
							break;
						case 'lastDay':
							request.param.date = DateFormat.format(DateFormat.addDay(new Date(), -2), 'yyyy-MM-dd');
							break;
						case 'lastWeek':
							request.param.date = DateFormat.format(DateFormat.addDay(new Date(), -8), 'yyyy-MM-dd');
							break;
						case 'lastMonth':
							request.param.date = DateFormat.format(DateFormat.addMonth(new Date(), -1), 'yyyy-MM-dd');
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
			//处理查询返回的数据
			handleResult(){
				let resultData = {};
				//默认显示数据
				resultData.defaultDay = this.getQueryResult(this.paramsProcess('defaultDay')) || {};
				//前一天数据
				resultData.lastDay = this.getQueryResult(this.paramsProcess('lastDay')) || {};
				//上周数据
				resultData.lastWeek = this.getQueryResult(this.paramsProcess('lastWeek')) || {};
				//上月数据
				resultData.lastMonth = this.getQueryResult(this.paramsProcess('lastMonth')) || {};
				return resultData
			},
			//获取查询结果
            getQueryResult(searchParam) {
				var ResultData;
                return situationService.getQueryResult(searchParam).then(res => {
                    if (res.status != CONSTANT.HTTP_STATUS.SUCCESS.CODE) {
                        this.$Message.error(res.message || CONSTANT.HTTP_STATUS.SERVER_ERROR.MSG);
                        return;
                    };
					return res.data
                });
            },	
            getProvinceList() {
                return situationService.getProvinceList().then(res => {
                    if (res.status != CONSTANT.HTTP_STATUS.SUCCESS.CODE) {
                        this.$Message.error(res.message || CONSTANT.HTTP_STATUS.SERVER_ERROR.MSG);
                        return;
                    }; 
					this.provinceList = res.data.data;
                });
            },																		
		}

    }
</script>