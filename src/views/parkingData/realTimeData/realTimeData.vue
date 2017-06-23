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
		<condition-query></condition-query>
	</div>
	<div class="divisionLine"></div>
	<div class="layout-content-situation">
		<situation-panel></situation-panel>
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
import tabCharts from './components/tabCharts.vue'
	import conditionQuery from './components/conditionQuery.vue'
	import parkingTable from './components/parkingTable.vue'
	import situationPanel from './components/situationPanel.vue'
	import DateFormat from '../../../commons/utils/formatDate.js';
	import {mapState, mapActions, mapGetters} from 'vuex';
export default {

	data (){
		return {
			currentDate: '2017-01-01 00:00:00',
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
	watch:{
		'queryParam':{
			deep:true,
			handler:function(newVal,oldVal){
				this.$store.dispatch('getCurrentResult',newVal)
			},
		}
	},
	computed: {
			//获取当前页面名称 
			currentPage () {
				return this.$route.path;
			},		
		...mapState({
			queryParam: 'queryParam'
		}),			
	},	 
	components: {
		'tab-charts': tabCharts,
		'condition-query': conditionQuery,
		'parking-table': parkingTable,
		'situation-panel':situationPanel
	},
	mounted () {
	this.$store.commit('SET_CURRENT_PAGNAME',this.currentPage);
		 this.interval= setInterval(() => {
				this.$store.dispatch('getCurrentResult',this.queryParam)
		 }, 10000);
	 },
	beforeDestroy () {
		clearInterval(this.interval)
    }	   
}
</script>