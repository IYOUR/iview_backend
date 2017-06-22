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
	.layout-content-table{
		padding: 15px;
		padding-top: 20px;
	}

</style>
<template>
<div>
	<keep-alive>
		<condition-query></condition-query>
	</keep-alive>
	<div class="divisionLine"></div>
	<div class="layout-content-situation">
		<situation-panel></situation-panel>
	</div>
	<div class="divisionLine"></div>	
	<div class="layout-content-charts">
		<tab-charts></tab-charts>
	</div>
	<div class="layout-content-table">
		<parking-table :table-showdata="tableData"></parking-table>
	</div>
</div> 
</template>

<script>
	import tabCharts from '../../components/parkingData/tabCharts.vue'
	import conditionQuery from '../../components/parkingData/conditionQuery.vue'
	import parkingTable from '../../components/parkingData/parkingTable.vue'
	import situationPanel from '../../components/parkingData/situationPanel.vue'
	import * as situationService from '../../api/situation';
	import axios from 'axios';
	import CONSTANT from '../../commons/utils/code';
	import {mapState, mapActions, mapGetters} from 'vuex';
export default {

	data (){
		return {
			queryParamData: {},
			resultData: {},
			queryResData: {},

			tableData: {
				columns: [
					{
						title: '日期',
						key: 'date'
					},
					{
						title: '完成停车数量',
						key: 'dedup_finish'
					},
					{
						title: '完成停车次数',
						key: 'finish'
					},
					{
						title: '总收入(元)',
						key: 'charge'
					},
					{
						title: '平均每辆车付费(元)',
						key: 'averageCharge' 
					},
					{
						title: '平均每次停车付费(元)',
						key: 'eachCharge'
					},
					{
						title: '车位数量',
						key: 'space'
					},
					{
						title: '停车场数量',
						key: 'parks'
					}																				
				],
				data: []
			}
		}
	},
	watch:{
		'queryParam':{
			deep:true,
			handler:function(newVal,oldVal){
				this.sendRquest(newVal);
			},
		}
	},
	computed: {
		...mapState({
			queryParam: 'queryParam'
		}),			
	},	 	
	methods: {

		//发送各个查询条件
		sendRquest(params){
			return axios.all([
				this.getQueryResult({name: 'defaultDay',val:params.defaultDay}), 
				this.getQueryResult({name: 'lastDay',val:params.lastDay}),
				this.getQueryResult({name: 'lastWeek',val:params.lastWeek}),
				this.getQueryResult({name: 'lastMonth',val:params.lastMonth}),
				this.getQueryResult({name: 'pastWeek',val:params.pastWeek})
			]).then(axios.spread((acct, perms) => {
				this.$store.commit('SET_QUERY_RESULT',perms);
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
		handleTableData(res) {
			
			let tableShowData = Object.assign({}, res.data),rowData = [];

			for(let item in tableShowData) {
				 let raw = {
				 	date:tableShowData[item].date,
				 	dedup_finish:tableShowData[item].dedup_finish,
				 	finish:tableShowData[item].finish,
				 	charge:(tableShowData[item].charge/100).toFixed(2),
				 	averageCharge:(tableShowData[item].charge/tableShowData[item].dedup_finish/100).toFixed(2),
				 	eachCharge:(tableShowData[item].charge/tableShowData[item].finish/100).toFixed(2),
				 	space:tableShowData[item].space,
				 	parks:tableShowData[item].parks,
				 }
				 rowData.push(raw);
			}
			this.tableData.data = rowData;
		}
	},
	components: {
		'tab-charts': tabCharts,
		'condition-query': conditionQuery,
		'parking-table': parkingTable,
		'situation-panel':situationPanel
	}  
}
</script>