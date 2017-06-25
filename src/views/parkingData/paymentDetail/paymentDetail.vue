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
	<condition-query></condition-query>
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
			<Col span="12" v-for="(item,idx) in rankData" :key="idx">
				<p>{{item.title}}</p>
				<Table border :columns="item.columns" :data="item.data"></Table>
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
	import {mapState, mapActions, mapGetters} from 'vuex';	
export default {

	data (){
		return {
			rankData: [
				{
					title: '停车车辆排行',
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
							title: '收入',
							key: 'charge'
						}						
					],
					data: []
				},
				{
					title: '车位使用率排行',
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
							title: '车位平均价值',
							key: 'worth'
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
				this.$store.dispatch('getPaymentDetail',newVal.defaultDay)
			},
		}
	},
	computed: {
		...mapState({
			queryParam: 'queryParam'
		}),			
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