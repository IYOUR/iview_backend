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
	<condition-query v-on:queryResult="showResult"></condition-query>
	<div class="divisionLine"></div>
	<div class="layout-content-situation">
		<situation-panel :situation-panel-data="situationData"></situation-panel>
	</div>
	<div class="divisionLine"></div>	
	<div class="layout-content-charts">
		<tab-charts :tab-item="tabItems"></tab-charts>
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
export default {

	data (){
		return {
			situationData: [
				{
					title:'车位数量',
					num: '12341',
					lastDay:['8812','86%',true],	
					lastWeek:['8812','86%',true],
					lastMonth:['8812','86%',false]
				},
				{
					title:'停车场数量',
					num: '12341',
					lastDay:['8812','86%',true],	
					lastWeek:['8812','86%',true],
					lastMonth:['8812','86%',true]
				},
				{
					title:'当日完成停车辆数',
					num: '12341',
					lastDay:['8812','86%',false],	
					lastWeek:['8812','86%',true],
					lastMonth:['8812','86%',true]
				},
				{
					title:'总收入',
					num: '12099',
					lastDay:['8812','86%',true],	
					lastWeek:['8812','86%',false],
					lastMonth:['8812','86%',true]
				},		
				{
					title:'平均每辆车付费',
					num: '19.99',
					lastDay:['8812','86%',true],	
					lastWeek:['8812','86%',true],
					lastMonth:['8812','86%',true]
				}															
			],
			tabItems:['当日完成停车数量','当日完成停车次数','总收入','平均每辆车付费','平均每次停车付费','车位数量','停车数量'],
			tableData: {
				columns1: [
					{
						title: '日期',
						key: 'name'
					},
					{
						title: '完成停车数量',
						key: 'age'
					},
					{
						title: '完成停车次数',
						key: 'address'
					},
					{
						title: '总收入(元)',
						key: 'income'
					},
					{
						title: '平均每辆车付费(元)',
						key: 'eachPay' 
					},
					{
						title: '平均每次停车付费(元)',
						key: 'eachParkPay'
					},
					{
						title: '车位数量',
						key: 'space'
					},
					{
						title: '停车场数量',
						key: 'parkNum'
					}																				
				],
				data1: [

				]
			}
		}
	},
	methods: {
		showResult(data) {
			console.log(data)
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