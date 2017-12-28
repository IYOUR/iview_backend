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
    .filtrate-title{
		text-align: center;
		font-size: 14px;
	}
	.layout-content-situation{
		padding: 15px;
	}
	.datePicker{
		width: 100%;
	}
    .page{
        float:right;
        margin-top:20px;
        margin-bottom: 100px;
    }	
</style>
<template>
<div>
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
							<Option v-if="showCity" v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
						</Select>
					</Form-item>
					<Form-item label="日期:">
						<Date-picker class="datePicker" v-model="queryDate" format="yyyy/MM/dd" type="date" :options="disableDate" placement="bottom-end" placeholder="选择日期"></Date-picker> 
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
	<div class="divisionLine"></div>
	<div class="layout-content-situation">
		<Tabs type="card" v-model="tabActive">
			<TabPane name="fail" label="失败详情">
				<Table border :columns="tableData_fail.columns" :data="tableData_fail.data" ref="fail"></Table> 
				<div class="page">
					<Page :total="failPage.totalPage" :current="failPage.pagenum" @on-change="nextPageFail"></Page>
				</div>								
			</TabPane>
			<TabPane name="outTime" label="成功>5s详情">
				<Table border :columns="tableData_outTime.columns" :data="tableData_outTime.data" ref="outTime"></Table> 
				<div class="page">
					<Page :total="timeoutPage.totalPage" :current="timeoutPage.pagenum" @on-change="nextPageTimeout"></Page>
				</div>						
			</TabPane>
			<Button type="ghost" @click="exportData" size="small" slot="extra">导出CSV</Button>
		</Tabs>		    		
	</div>
	
</div> 
</template>

<script>
import {mapState, mapActions, mapGetters} from 'vuex';
import * as situationService from '../../../api/situation';
import CONSTANT from '../../../commons/utils/code';
import DateFormat from '../../../commons/utils/formatDate.js';
export default {

	data (){
		return {
			disableDate: {
				disabledDate (date) {
					return date && date.valueOf() > Date.now();
				}					
			},
			timeoutPage: {
				totalPage: 0,
				pagenum: 1,
				size: 20 
			},				
			failPage: {
				totalPage: 0,
				pagenum: 1,
				size: 20 
			},			
			dateClearable: false,   
			showCity:false,
			showPark:false,	
			companyPark: [],
			cityPark: [],	
			queryDate: '',	
			tabActive: 'fail',		
			tableData_fail: {
				columns: [
					{
						title: '时间',
						key: 'date',
						width: '130'
					},
					{
						title: '集团',
						key: 'group',
						width: '180'
					},
					{
						title: '车场',
						key: 'park',
						width: '180'
					},
					{
						title: 'ARM版本',
						key: 'arm',
						width: '100' 
					},
					{
						title: '下发类型',
						key: 'type' ,
						width: '100'
					},						
					{
						title: '失败类型',
						key: 'type_fail' ,
						width: '100'
					},
					{
						title: '下发失败详情',
						key: 'faildetail' 
					}																						
				],
				data: []
			}, 	
			tableData_outTime: {
				columns: [
					{
						title: '时间',
						key: 'date',
						width: '130'
					},
					{
						title: '集团',
						key: 'group',
						width: '180'
					},
					{
						title: '车场',
						key: 'park',
						width: '180'
					},
					{
						title: 'ARM版本',
						key: 'arm',
						width: '100' 
					},					
					{
						title: '下发类型',
						key: 'type' ,
						width: '100'
					},					
					{
						title: '下发失败详情',
						key: 'faildetail' 
					}																						
				],
				data: []
			}, 						  			
		}
	},
	watch:{
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
		'queryParam':{
			deep:true,
			handler:function(newVal,oldVal){
				this.getNetworkError(newVal.toDay);
				this.getNetworkTimeout(newVal.toDay)
			},
		}
	},
	computed: {
		...mapState({
			provinceList: 'provinceList',
			companyList: 'companyList',
			parkList: 'parkList',
			cityList: 'cityList',
			queryData: 'queryData',
			queryParam: 'queryParam'
		}),
	},
	mounted () {
		this.loadAreaInfo();
		if(this.$route.query.date&&this.$route.query.date=='5s'){
			this.queryDate = new Date();
			this.tabActive = 'outTime';
		}else{
			this.queryDate = this.$route.query.date? DateFormat.formatToDate(this.$route.query.date) : new Date();
		}
		this.$store.commit('SET_QUERY_PARAM',this.packQueryParams());
	},	
	methods: {
		...mapActions({
			getProvinceList: 'getProvinceList',
			getCompanyList: 'getCompanyList',
			getParkLists: 'getParkLists'
		}),	
		nextPageFail (value) {
			this.failPage.pagenum = value;
			this.getNetworkError(this.queryParam.toDay)
		},  
		nextPageTimeout (value) {
			this.timeoutPage.pagenum = value;
			this.getNetworkTimeout(this.queryParam.toDay)
		},  		 				
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
			this.queryDate = '';
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
			let queryParam = Object.assign({}, this.queryData), request = {url:'',param:{}};
			request.url = 'province/0';
			if(this.queryDate==''){
				request.param.date = DateFormat.format(new Date(), 'yyyy-MM-dd');
			}
			else{
				request.param.date = DateFormat.format(this.queryDate, 'yyyy-MM-dd');
			}
			
			if (queryParam.park_code.length !== 0) {
				request.url = `park/${queryParam.park_code}`;
				return request;
			}
			if (queryParam.company.length !== 0) {
				request.url = `company/${queryParam.company}`;
				return request;
			}
			if (queryParam.city.length !== 0) {
				request.url = `city/${queryParam.city}`;
				return request;
			}
			if (queryParam.province.length !== 0) {
				request.url = `province/${queryParam.province}`;
				return request;
			}
			return request;
		},
		//包装各个日期的查询参数
		packQueryParams() {
			return  {toDay: this.paramsProcess('toDay')}
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
		//获取网络下发失败详情	
		getNetworkError(param) {
			let params = param;
			params.param.pagenum = this.failPage.pagenum;
			params.param.size = this.failPage.size;
			return situationService.getNetworkError(params).then(res => {
				if (res.status != CONSTANT.HTTP_STATUS.SUCCESS.CODE) {
					this.$Message.error(res.message || CONSTANT.HTTP_STATUS.SERVER_ERROR.MSG);
					return;
				}; 
				this.failPage.totalPage = res.data.data.total*10;
				this.handleTableData({data:res.data.data.infos,type:'fail'});
			});
		},	
		//获取网络下发超时详情	
		getNetworkTimeout(param) {
			let params = param;
			params.param.pagenum = this.timeoutPage.pagenum;
			params.param.size = this.timeoutPage.size;
			return situationService.getNetworkTimeout(params).then(res => {
				if (res.status != CONSTANT.HTTP_STATUS.SUCCESS.CODE) {
					this.$Message.error(res.message || CONSTANT.HTTP_STATUS.SERVER_ERROR.MSG);
					return;
				}; 
				this.timeoutPage.totalPage = res.data.data.total*10;
				this.handleTableData({data:res.data.data.infos,type:'timeOut'});
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
		},			
		handleTableData(res) {
			let tableShowData = Object.assign({}, res.data),rowData_fail = [],rowData_outTime = [];

			for(let item in tableShowData) {
				if(res.type=='fail'){
					this.tableData_fail.data.push({
						date:tableShowData[item].ctime,
						group:this.transform({value:tableShowData[item].company_code,type:'group'}),
						park:this.transform({value:tableShowData[item].park_code,type:'park'}),
						type: tableShowData[item].msg_type,
						arm:tableShowData[item].arm_version,
						faildetail:tableShowData[item].msg,
					});
				}else {
					this.tableData_outTime.data.push({
						date:tableShowData[item].ctime,
						group:this.transform({value:tableShowData[item].company_code,type:'group'}),
						park:this.transform({value:tableShowData[item].park_code,type:'park'}),
						type: tableShowData[item].msg_type,
						type_fail:(tableShowData[item].status==0)?'超时':'失败',
						arm:tableShowData[item].arm_version,
						faildetail:tableShowData[item].msg,
					});
				}

			}
			// this.tableData_fail.data = rowData_fail;
			// this.tableData_outTime.data = rowData_outTime;
		},			
		//将车场对应的code转换为名称
		transform(data) {
			let companyList = JSON.parse(sessionStorage.getItem('companyList')) || [],
				parkList = JSON.parse(sessionStorage.getItem('parkList')) || [];
				if(data.type=='group'){
					for(let i in companyList){
						if(companyList[i].value==data.value){
							return companyList[i].label
						}
					}
				}
				if(data.type=='park'){
					for(let i in parkList){
						if(parkList[i].value==data.value){
							return parkList[i].label
						}
					}				
				}
			return data.value
		},
		//导出CSV
		exportData () {
			if(this.tabActive == 'fail'){
				this.$refs.fail.exportCsv({
					filename: '下发失败详情'
				});				
			}else{
				this.$refs.outTime.exportCsv({
					filename: '下发成功响应大于5s详情'
				});
			}
		},																															
	},		  
}
</script>