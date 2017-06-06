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
	<div class="layout-content-situation">
		<Row type="flex" justify="space-between" class="code-row-bg">
			<Col span="4">
				<div class="situation-item">
					<p>车位数量:</p>
					<p class="number"><span>12341</span></p>
					<p class="comparison">
						<Row type="flex" justify="space-around" class="code-row-bg">
							<Col span="10">
								<table>
									<tr>
										<td>前一天:</td>
										<td>1099</td>
									</tr>
									<tr>
										<td>同比上周:</td>
										<td>1099</td>
									</tr>
									<tr>
										<td>同比上月:</td>
										<td>1099</td>
									</tr>																		
								</table>								
							</Col>
							<Col span="10">
								<table style="float:right;">
									<tr>
										<td>环比:</td>
										<td>68%<Icon type="arrow-up-c"></Icon></td>
									</tr>
									<tr>
										<td>同比:</td>
										<td>32%<Icon type="arrow-up-c"></Icon></td>
									</tr>
									<tr>
										<td>同比:</td>
										<td>34%<Icon type="arrow-down-c"></Icon></td>
									</tr>																		
								</table>								
							</Col>
						</Row>		
					</p>
				</div>
			</Col>
			<Col span="4">col-4</Col>
			<Col span="4">col-4</Col>
			<Col span="4">col-4</Col>
			<Col span="4">col-4</Col>
		</Row>
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
export default {

	data (){
		return {
			tabItems:['当日完成停车数量','当日完成停车数','总收入','平均每辆车付费','平均每次停车付费','车位数量','停车数量'],
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