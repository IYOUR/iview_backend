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
	.datePicker{
		width:100%;
	}
</style>
<template>
	<div class="layout-content-filtrate">
		<Form :model="queryData" label-position="right" :label-width="100">
			<row>
				<Col span="2" class="filtrate-title">
					<span>条件选择:</span>
				</col>
				<Col span="7">
					<Form-item label="省份:">
						<Select v-model="queryData.province" @on-change="selectProvince" clearable placeholder="请选择">
							<Option v-for="item in provinceList" :value="item.value" :key="item.value">{{ item.label }}</Option>
						</Select>
					</Form-item>
					<Form-item label="停车场:">
						<Select v-model="queryData.park_code" filterable clearable placeholder="请选择">
							<Option value="null" v-if="!showPark" disabled>暂无数据</Option>
							<Option v-if="showPark" v-for="item in parkList" :value="item.value" :key="item.value">{{ item.label }}</Option>
						</Select>
					</Form-item>
				</col>
				<Col span="7">
					<Form-item label="城市:">
						<Select v-model="queryData.city" @on-change="selectCity" clearable placeholder="请选择">
							<Option value="null" v-if="!showCity" disabled>暂无数据</Option>
							<Option v-if="showCity"  v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
						</Select>
					</Form-item>
					<Form-item label="选择日期:">
						<Date-picker class="datePicker" v-model="queryData.date" format="yyyy/MM/dd" type="daterange" :options="disableDate" placement="bottom-end" placeholder="开始时间 - 结束时间 "></Date-picker>
					</Form-item>								
				</col>
				<Col span="7">			
					<Form-item label="集团:">
						<Select v-model="queryData.company" @on-change="selectCompany" filterable clearable placeholder="请选择">
							<Option v-for="item in companyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
	import DateFormat from '../../commons/utils/formatDate';
	import {mapState, mapActions, mapGetters} from 'vuex';
    export default {
		data() {
			return {
				disableDate: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now()-86400000;
                    }					
				},
				showCity:false,
				showPark:false,
				resultData: {}
			}
		},
		computed: {
            ...mapState({
                provinceList: 'provinceList',
                companyList: 'companyList',
				parkList: 'parkList',
				cityList: 'cityList',
				queryData: 'queryData'
            }),					
		},
        mounted () {
			this.loadAreaInfo();
			this.$store.commit('SET_QUERY_PARAM',this.packQueryParams());
        },
        watch: {
            'cityList':{
				immediate: true,
                handler(newVal,oldVal){
					if(newVal.length>0) {
						this.showCity = true;
					} else 
					this.showCity = false;
                },
            },
            'parkList':{
				immediate: true,
                handler(newVal,oldVal){
					if(newVal.length>0) {
						this.showPark = true;
					} else 
					this.showPark = false;
                },
            },
			'queryData':{
				deep:true,
                handler(newVal,oldVal){
					this.$store.commit('SET_QUERY_DATA',this.queryData);
                },			
			}			
        },
		methods: {
            ...mapActions({
                getProvinceList: 'getProvinceList',
				getCompanyList: 'getCompanyList',
				getParkLists: 'getParkLists'
            }),			
			selectProvince(value) {
				if(value !==''){
					this.getCityList({levelType:'2',parent:value});
					this.getParkList({province:value})	
				}
			},		
			selectCity(value) {
				if(value !== ''){
					this.getParkList({city:value});	
				}
			},	
			selectCompany(value) {
				if(value !== ''){
					this.getParkList({company:value});	
				}
			},			
			//点击查询
			query() {
				this.$store.commit('SET_QUERY_PARAM',this.packQueryParams())				
			},
			//点击重置
            reset() {
				let data = {
					province: '',
					park_code: '',
					city: '',
					date: [],
					company: ''
				};
				this.$store.commit('SET_QUERY_DATA',data);
				this.$store.commit('SET_CITY_LIST',[]);
				this.$store.commit('SET_PARK_LIST',[])
            },
			//加载查询条件信息
			loadAreaInfo() {
				if(this.provinceList.length === 0){
					this.getProvinceList();
					this.getCompanyList();
					this.getParkLists();
				}
			},
            //参数处理
            paramsProcess (type){
                let queryData = Object.assign({}, this.queryData), request = {url:'',param:{}},queryDate;
				if (queryData.date.length === 0 || queryData.date[0] === null) {
					request.url = 'province/0/range';
					switch (type) {
						case 'defaultDay':
							request.param.sdate = request.param.edate = DateFormat.format(DateFormat.addDay(new Date(), -1), 'yyyy-MM-dd');
							break;
						case 'lastDay':
							request.param.sdate = request.param.edate = DateFormat.format(DateFormat.addDay(new Date(), -2), 'yyyy-MM-dd');
							break;
						case 'lastWeek':
							request.param.sdate = request.param.edate = DateFormat.format(DateFormat.addDay(new Date(), -7), 'yyyy-MM-dd');
							break;
						case 'lastMonth':
							request.param.sdate = request.param.edate = DateFormat.format(DateFormat.addMonth(new Date(), -1), 'yyyy-MM-dd');
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
							request.param.sdate = DateFormat.changeDate(queryData.date[0]);
							request.param.edate = DateFormat.changeDate(queryData.date[1]);
							break;
						case 'lastDay':
							request.param.sdate = DateFormat.changeDate(DateFormat.addDayStr(DateFormat.changeDate(queryData.date[0]),-1));
							request.param.edate = DateFormat.changeDate(DateFormat.addDayStr(DateFormat.changeDate(queryData.date[1]),-1));
							break;
						case 'lastWeek':
							request.param.sdate = DateFormat.changeDate(DateFormat.addDayStr(DateFormat.changeDate(queryData.date[0]),-7));
							request.param.edate = DateFormat.changeDate(DateFormat.addDayStr(DateFormat.changeDate(queryData.date[1]),-7));
							break;
						case 'lastMonth':
							request.param.sdate = DateFormat.changeDate(DateFormat.addMonthStr(DateFormat.changeDate(queryData.date[0]),-1));
							request.param.edate = DateFormat.changeDate(DateFormat.addMonthStr(DateFormat.changeDate(queryData.date[1]),-1));
							break;
						//过去的一周时间内	
						case 'pastWeek':
							request.param.sdate = DateFormat.changeDate(queryData.date[0]);
							request.param.edate = DateFormat.changeDate(queryData.date[1]);
							break;								
					}								
				}	
				if (queryData.park_code.length !== 0) {
					request.url = `park/${queryData.park_code}/range`;
					return request;
				}
				if (queryData.company.length !== 0) {
					request.url = `company/${queryData.company}/range`;
					return request;
				}
				if (queryData.city.length !== 0) {
					request.url = `city/${queryData.city}/range`;
					return request;
				}
				if (queryData.province.length !== 0) {
					request.url = `province/${queryData.province}/range`;
					return request;
				}
                return request;
            },
			//包装各个日期的查询参数
			packQueryParams () {
				return {
					defaultDay: this.paramsProcess('defaultDay'),
					lastDay: this.paramsProcess('lastDay'),
					lastWeek: this.paramsProcess('lastWeek'),
					lastMonth: this.paramsProcess('lastMonth'),
					pastWeek: this.paramsProcess('pastWeek'),
				};
			},				
			//获取城市列表	
            getCityList (params) {
                return situationService.getCityList(params).then(res => {
                    if (res.status != CONSTANT.HTTP_STATUS.SUCCESS.CODE) {
                        this.$Message.error(res.message || CONSTANT.HTTP_STATUS.SERVER_ERROR.MSG);
                        return;
                    }; 
					this.cityList = res.data.data;
					this.$store.commit('SET_CITY_LIST',res.data.data)
                });
            },
			getParkList (params) {
				return situationService.getParkList(params).then(res => {
                    if (res.status != CONSTANT.HTTP_STATUS.SUCCESS.CODE) {
                        this.$Message.error(res.message || CONSTANT.HTTP_STATUS.SERVER_ERROR.MSG);
                        return;
                    }; 
					this.parkList = res.data.data;
					this.$store.commit('SET_PARK_LIST',res.data.data)
				});
			},																										
		},  		
    }
</script>