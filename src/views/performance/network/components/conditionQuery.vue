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
					<Form-item label="集团:">
						<Select v-model="queryData.company" @on-change="selectCompany" filterable clearable placeholder="请选择">
							<Option v-for="item in companyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
						</Select>
					</Form-item>
				</col>
				<Col span="7">
					<Form-item label="城市:">
						<Select v-model="queryData.city" @on-change="selectCity" clearable placeholder="请选择">
							<Option value="null" v-if="!showCity" disabled>暂无数据</Option>
							<Option v-if="showCity" v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
						</Select>
					</Form-item>
					<!-- 实时页面显示 -->
					<Form-item label="停车场:">
						<Select v-model="queryData.park_code" filterable clearable placeholder="请选择">
							<Option value="null" v-if="!showPark" disabled>暂无数据</Option>
							<Option v-if="showPark" v-for="item in parkList" :value="item.value" :key="item.value">{{ item.label }}</Option>
						</Select>
					</Form-item>								
				</col>
				<Col span="7">
					<!-- 实时页面显示 -->
					<Form-item>
						<p class="currentDate">{{currentDate}}</p>
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
import * as situationService from '../../../../api/situation';
import CONSTANT from '../../../../commons/utils/code';
import DateFormat from '../../../../commons/utils/formatDate.js';
import {mapState, mapActions, mapGetters} from 'vuex';
export default {
	data() {
		return {
			currentDate: '2017-01-01 00:00:00',
			showCity:false,
			showPark:false,	
			companyPark: [],
			cityPark: []
		}
	},
	computed: {
		timeDiff() {
			return JSON.parse(unescape(sessionStorage.getItem('userInfo'))).timeDiff;
		},
		...mapState({
			provinceList: 'provinceList',
			companyList: 'companyList',
			parkList: 'parkList',
			cityList: 'cityList',
			queryData: 'queryData'
		}),			
	},
	created () {
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
			this.$store.commit('SET_PARK_LIST',[]);
			this.query();
		},
		//加载查询条件信息
		loadAreaInfo() {
			if(this.provinceList.length === 0){
				this.getProvinceList();
			}
		},
		//参数处理
		paramsProcess(type){
			let queryParam = Object.assign({}, this.queryData), request = {url:'',param:{}},queryDate;
			request.url = 'province/0/day';
			switch (type) {
				case 'toDay':
					request.param.date = DateFormat.format(new Date(), 'yyyy-MM-dd');
					break;
				case 'lastDay':
					request.param.date = DateFormat.format(DateFormat.addDay(new Date(), -1), 'yyyy-MM-dd');
					break;
				case 'pastWeek':
					request.param.sdate = DateFormat.format(DateFormat.addDay(new Date(), -7), 'yyyy-MM-dd');
					request.param.edate = DateFormat.format(DateFormat.addDay(new Date(), -1), 'yyyy-MM-dd');
					break;						
			}

			if (queryParam.park_code.length !== 0) {
				request.url = `park/${queryParam.park_code}/day`;
				return request;
			}
			if (queryParam.company.length !== 0) {
				request.url = `company/${queryParam.company}/day`;
				return request;
			}
			if (queryParam.city.length !== 0) {
				request.url = `city/${queryParam.city}/day`;
				return request;
			}
			if (queryParam.province.length !== 0) {
				request.url = `province/${queryParam.province}/day`;
				return request;
			}
			return request;
		},
		//包装各个日期的查询参数
		packQueryParams() {
			let param = {
				toDay: this.paramsProcess('toDay'),
				lastDay: this.paramsProcess('lastDay'),
				pastWeek: this.paramsProcess('pastWeek'),
				}
			return param;
		},				
		//获取城市列表	
		getCityList(params) {
			return situationService.getCityList(params).then(res => {
				if (res.status != CONSTANT.HTTP_STATUS.SUCCESS.CODE) {
					this.$Message.error(res.message || CONSTANT.HTTP_STATUS.SERVER_ERROR.MSG);
					return;
				}; 
				this.cityList = res.data.data; 
				this.$store.commit('SET_CITY_LIST',res.data.data)
			});
		},
		getParkList(params) {
			return situationService.getParkList(params).then(res => {
				if (res.status != CONSTANT.HTTP_STATUS.SUCCESS.CODE) {
					this.$Message.error(res.message || CONSTANT.HTTP_STATUS.SERVER_ERROR.MSG);
					return;
				}; 
				if(params.company){
					this.companyPark = res.data.data;
				} else{
					this.cityPark = res.data.data;
				}
				//判断是否为地区和集团的双筛选条件
				if(this.queryData.company.length !== 0&&(this.queryData.province.length !== 0||this.queryData.city.length !== 0)){
					this.$store.commit('SET_PARK_LIST',this.progressParkList ());
				} else{
					let delay = setTimeout(()=>{
						this.$store.commit('SET_PARK_LIST',res.data.data)
					},100);
				}
			});
		},
		//筛选出地区和集团共有的车场
		progressParkList () {
			let arr = [];
			for(let i in this.cityPark){
				for(let j in this.companyPark) {
					if(JSON.stringify(this.cityPark[i])===JSON.stringify(this.companyPark[j])){
						arr.push(this.cityPark[i])
					}
				}
			}
			return arr;
		}																																
	},
	mounted () {
		this.interval= setInterval(() => {
				//本地时间加上和服务器的时间差为线上时间
				this.currentDate = DateFormat.format(new Date((Date.parse(new Date())/1000+this.timeDiff)*1000), 'yyyy-MM-dd hh:mm:ss');
		}, 1000);
	},
	beforeDestroy () {
		clearInterval(this.interval);
	}	  		
}
</script>