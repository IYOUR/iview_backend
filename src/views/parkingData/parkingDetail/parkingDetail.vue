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
	.situation-item .number{
		text-align: center;
		font-size: 30px;
		padding: 10px;
	}
	.situation-item .comparison{
		font-size: 10px;;
	}
	.layout-content-table{
		padding: 15px;
		padding-top: 20px;
	}
	.layout-content-tablePie{
		padding: 15px;
	}
	.layout-content-tablePie p{
		padding-bottom: 10px;
	}
	.layout-content-rankList{
		padding: 15px;
	}
	.layout-content-rankList p{
		padding-bottom: 10px;
	}
</style>
<template>
<div>
	<keep-alive>
		<condition-query></condition-query>
	</keep-alive>
	<div class="divisionLine"></div>
	<div class="layout-content-charts">
		<tab-charts></tab-charts>
	</div>
	<div class="layout-content-table">
		<parking-table></parking-table>
	</div>
	<div class="divisionLine"></div>
	<div class="layout-content-tablePie">
		<Row :gutter="16">
			<Col span="12">
				<p>进场车辆类型分布</p>
				<cartype-pie></cartype-pie>
			</Col>
			<Col span="12">
				<p>停车时长分布</p>
				<parktimes-pie></parktimes-pie>
			</Col>
		</Row>	
	</div>
	<div class="divisionLine"></div>
	<div class="layout-content-rankList">
		<Row :gutter="16">
			<Col span="8" v-for="(item,idx) in rankTable" :key="idx">
				<p>{{item.title}}</p>
				<Table border :columns="item.columns" :data="item.data"></Table>
			</Col>
		</Row>
	</div>
</div> 
</template>

<script>
import tabCharts from './components/tabCharts.vue'
import conditionQuery from '../../../components/parkingData/conditionQuery.vue'
import parkingTable from './components/parkingTable.vue'
import carTypePie from './components/carTypePie.vue'
import parkTimesPie from './components/parkTimesPie.vue'
import {mapState, mapActions, mapGetters} from 'vuex';
export default {

	data (){
		return {
			rankTable: [
				{
					title: '停车车辆排行',
					name: 'ins_outs',
					columns: [
						{
							title: '名次',
							key: 'order'
						},
						{
							title: '停车场名称',
							key: 'parkName'
						},
						{
							title: '所属集团',
							key: 'group'
						},
						{
							title: '停车数量',
							key: 'num'
						}						
					],
					data: []
				},
				{
					title: '车位使用率排行',
					name: 'spaceratio',
					columns: [
						{
							title: '名次',
							key: 'order'
						},
						{
							title: '停车场名称',
							key: 'parkName'
						},
						{
							title: '所属集团',
							key: 'group'
						},
						{
							title: '车位使用率',
							key: 'num'
						}						
					],
					data: []
				},
				{
					title: '单位时间内进出车数量排行',
					name: 'finish',
					columns: [
						{
							title: '名次',
							key: 'order'
						},
						{
							title: '停车场名称',
							key: 'parkName'
						},
						{
							title: '所属集团',
							key: 'group'
						},
						{
							title: '单位时间内进出车数量',
							key: 'num'
						}						
					],
					data: []
				},								
			]

		}
	},
	watch:{
		'queryParam':{
			deep:true,
			handler:function(newVal,oldVal){
				newVal.carType = {
					url : newVal.pastWeek.url.match(/(\S*)\/range/)[1],
					param : newVal.pastWeek.param
				}				
				let rankParam = newVal.defaultDay;
				rankParam.param.sdate = newVal.defaultDay.param.edate;
				this.$store.dispatch('getParkDetail',newVal.pastWeek);
				this.$store.dispatch('getCarType',newVal.carType);
				this.$store.dispatch('getRankResult',this.packQueryParams(rankParam));
			}
		},
		'rankData':{
			deep:true,
			handler:function(newVal,oldVal){ 
				this.showRanktable();
			}
		}		
	},
	computed: {
		...mapState({
			queryParam: 'queryParam',
			rankData: 'rankData'
		}),			
	},	 	
	methods: {	
		//包装请求数据
		packQueryParams(param) {
			return {
				finish: this.paramsProcess(param,'finish'),
				space_ratio: this.paramsProcess(param,'space_ratio'),
				ins_outs: this.paramsProcess(param,'ins_outs'),
				charge: this.paramsProcess(param,'charge'),
				charge_by_space: this.paramsProcess(param,'charge_by_space'),								
			};
		},
		paramsProcess(param,type) {
			let queryParam = Object.assign({}, param),request = {url:'',param:{sdate:'',edate:'',type:''}};
			request.url = queryParam.url.match(/(\S*)\/range/)[1];
			request.param.sdate = queryParam.param.sdate;
			request.param.edate = queryParam.param.edate;
			switch (type) {
				case 'finish':
					request.param.type = type;
					break;	
				case 'space_ratio':
					request.param.type = type
					break;	
				case 'ins_outs':
					request.param.type = type;
					break;		
				case 'charge':
					request.param.type = type;
					break;	
				case 'charge_by_space':
					request.param.type = type;
					break;																								
			}
			return request			
		},
		showRanktable() {
			this.rankTable[0].data = this.transform('finish');
			this.rankTable[1].data = this.transform('space_ratio');
			this.rankTable[2].data = this.transform('ins_outs');
		},
		//将车场对应的code转换为名称
		transform(item) {
			let res = Object.assign([], this.rankData[item].data),arr=[],
				companyList = JSON.parse(sessionStorage.getItem('companyList')) || [],
				parkList = JSON.parse(sessionStorage.getItem('parkList')) || [];
				for(let i=0;i<res.length;i++) {
					let data = {};
						data.num = res[i].data;
						if(item == 'space_ratio') {
							data.num = `${(res[i].data/100).toFixed(2)}%`;
						}
						if(item == 'ins_outs') {
							data.num = (res[i].data/24).toFixed(2);
						}						
						data.order = i+1;
						data.parkName = res[i].parkcode;
						data.group = res[i].companycode;
					for(let j=0;j<companyList.length;j++) {
						if(res[i].companycode == companyList[j].value){
							data.group = companyList[j].label
						}
					}
					for(let j=0;j<parkList.length;j++) {
						if(res[i].parkcode == parkList[j].value){
							data.parkName = parkList[j].label
						}
					}	
					arr.push(data)			
				}
			return arr;			
		}
		
	},
	components: {
		'tab-charts': tabCharts,
		'condition-query': conditionQuery,
		'parking-table': parkingTable,
		'cartype-pie': carTypePie,
		'parktimes-pie': parkTimesPie
	}  
}
</script>