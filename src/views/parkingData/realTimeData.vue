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

</style>
<template>
<div>
	<div class="layout-content-filtrate">
		<condition-query v-on:queryParams="sendRquest"></condition-query>
	</div>
	<div class="divisionLine"></div>
	<div class="layout-content-situation">
		<situation-panel :situation-panel-data="situationData"></situation-panel>
	</div>
	<div class="divisionLine"></div>	
	<div class="layout-content-charts">
		<tab-charts></tab-charts>
	</div>
	<div class="layout-content-table">
		<parking-table></parking-table>
	</div>
</div> 
</template>

<script>
import tabCharts from '../../components/parkingData/tabCharts.vue'
import conditionQuery from '../../components/parkingData/conditionQuery.vue'
import parkingTable from '../../components/parkingData/parkingTable.vue'
import situationPanel from '../../components/parkingData/situationPanel.vue'
import DateFormat from '../../commons/utils/formatDate.js';
export default {

	data (){
		return {
			currentDate: '2017-01-01 00:00:00',
			tabItems:['实时进车次数','实时出车次数','实时完成停车数','实时停放数量','实时车位使用率','实时收入','实时新增车辆数'],
			situationData: [
				{
					title:'实时进车数',
					num: '12341',
					lastDay:['8812','86%',true]
				},
				{
					title:'实时出车数',
					num: '12341',
					lastDay:['8812','86%',true]
				},
				{
					title:'实时完成停车数',
					num: '12341',
					lastDay:['8812','86%',true]
				},
				{
					title:'实时停放辆数',
					num: '12341',
					lastDay:['8812','86%',false]
				},
				{
					title:'实时收入',
					num: '12341',
					lastDay:['8812','86%',true]
				},
								{
					title:'实时新增车辆数',
					num: '12341',
					lastDay:['8812','86%',true]
				}																
			],
			tableData: {
				columns1: [
					{
						title: '姓名',
						key: 'name'
					},
					{
						title: '年龄',
						key: 'age'
					},
					{
						title: '地址',
						key: 'address'
					}
				],
				data1: [
					{
						name: '王小明',
						age: 18,
						address: '北京市朝阳区芍药居'
					},
					{
						name: '张小刚',
						age: 25,
						address: '北京市海淀区西二旗'
					},
					{
						name: '李小红',
						age: 30,
						address: '上海市浦东新区世纪大道'
					},
					{
						name: '周小伟',
						age: 26,
						address: '深圳市南山区深南大道'
					}
				]
			}
		}
	},
	// computed: {
	// 	datePicker: function() {
	// 		return this.$route.path==='/realTimeData'?true:false;
	// 	}
	// },
	methods: {
		queryParams(param) {
			console.log(param)
		}
	},
	components: {
		'tab-charts': tabCharts,
		'condition-query': conditionQuery,
		'parking-table': parkingTable,
		'situation-panel':situationPanel
	},
	mounted () {
		 this.interval= setInterval(() => {
				this.currentDate = DateFormat.format(new Date(), 'yyyy-MM-dd hh:mm:ss');
		 }, 1000);
	 },
	beforeDestroy () {
		clearInterval(this.interval)
    }	   
}
</script>