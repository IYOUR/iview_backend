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
	.currentDate{
		text-align: center;
		font-size: 1.5vw;
    	font-weight: bold;
	}
</style>
<template>
<div>
	<div class="layout-content-filtrate">
		<Form label-position="right" :label-width="100">
			<row>
				<Col span="2" class="filtrate-title">
					<span>条件选择:</span>
				</col>
				<Col span="7">
					<Form-item label="省份:">
						<Select placeholder="请选择">
						</Select>
					</Form-item>
					<Form-item label="集团:">
						<Select placeholder="请选择">
						</Select>
					</Form-item>	
				</col>
				<Col span="7">
				
					<Form-item label="城市:">
						<Select placeholder="请选择">
						</Select>
					</Form-item>
					<Form-item label="停车场:">
						<Select placeholder="请选择">
						</Select>
					</Form-item>			
				</col>
				<Col span="7">
					<Form-item>
						<p class="currentDate">{{currentDate}}</p>
					</Form-item>
					<Form-item>
						<row :gutter="16">
							<Col span="12">
								<Button type="primary" style="width:100%;">查询</Button>
							</Col>
							<Col span="12">
								<Button type="ghost"  style="width:100%;">重置</Button>
							</Col>
						</row>	
					</Form-item>			
				</col>
			</row>	
		</Form>
	</div>
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