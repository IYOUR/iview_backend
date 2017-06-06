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

</style>
<template>
<div>
	<condition-query></condition-query>
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
export default {

	data (){
		return {
			tabItems:['总收入','平均每次付费','平均每车付费','支付完成到抬杆平均时间','未支付用户比','车位平均价值'],
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
	methods: {
	},
	components: {
		'tab-charts': tabCharts,
		'condition-query': conditionQuery,
		'parking-table': parkingTable
	}  
}
</script>