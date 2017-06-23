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
		<tab-charts :tab-item="tabItems"></tab-charts>
	</div>
	<div class="layout-content-table">
		<parking-table :table-showdata="tableData"></parking-table>
	</div>
	<div class="divisionLine"></div>
	<div class="layout-content-tablePie">
		<Row :gutter="16">
			<Col span="12">
				<p>进场车辆类型分布</p>
				<table-pie></table-pie>
			</Col>
			<Col span="12">
				<p>停车时长分布</p>
				<table-pie></table-pie>
			</Col>
		</Row>	
	</div>
	<div class="divisionLine"></div>
	<div class="layout-content-rankList">
		<Row :gutter="16">
			<Col span="8">
				<p>停车车辆排行</p>
				<Table border :columns="tableData.columns1" :data="tableData.data1"></Table>
			</Col>
			<Col span="8">
				<p>车位使用率排行</p>
				<Table border :columns="tableData.columns1" :data="tableData.data1"></Table>
			</Col>
			<Col span="8">
				<p>停车时长排行</p>
				<Table border :columns="tableData.columns1" :data="tableData.data1"></Table>
			</Col>
		</Row>
	</div>
</div> 
</template>

<script>
import tabCharts from './components/tabCharts.vue'
import conditionQuery from './components/conditionQuery.vue'
import parkingTable from './components/parkingTable.vue'
import tablePie from './components/tablePie.vue'
export default {

	data (){
		return {
			tabItems:{
				tabOption:[
					{label:'进场车数量',id:'dedup_finish'},
					{label:'出场车数量',id:'finish'},
					{label:'过夜数量',id:'charge'},
					{label:'车位使用率',id:'averageCharge'},
					{label:'平均停车时长',id:'eachCharge'},
					{label:'单位小时进出车辆数',id:'space'},
					{label:'新增车辆数',id:'parks'}
				],
				tabChartsData:{}
			},			
			//tabItems:['进场车数量','出场车数量','过夜数量','车位使用率','平均停车时长','单位小时进出车辆数','新增车辆数'],
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
		'parking-table': parkingTable,
		'table-pie': tablePie
	}  
}
</script>