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
		padding-top: 20px
	}
	.layout-content-tablePie{
		padding: 15px;
	}
	.layout-content-tablePie p{
		padding-bottom: 10px;
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
	<div class="layout-content-table">
		<day-charts></day-charts>
	</div>
	<div class="divisionLine"></div>
	<div class="layout-content-table">
		<range-charts></range-charts>
	</div>	
	<div class="divisionLine"></div>	
</div> 
</template>

<script>
import dayCharts from './components/dayCharts.vue'
import conditionQuery from './components/conditionQuery.vue'
import rangeCharts from './components/rangeCharts.vue'
import situationPanel from './components/situationPanel.vue'
import retryTimesPie from './components/retryTimesPie.vue'
import responseTimePie from './components/responseTimePie.vue'	
import DateFormat from '../../../commons/utils/formatDate.js';
import {mapState, mapActions, mapGetters} from 'vuex';
export default {

	data (){
		return {
			currentDate: '2017-01-01 00:00:00',
		}
	},
	watch:{
		'queryParam':{
			deep:true,
			handler:function(newVal,oldVal){
				let pastWeek = {
					value:{
						url:newVal.pastWeek.url.replace(/day/g,'range'),
						param:newVal.pastWeek.param
					},
					type:'range'
				},
					toDay = {
						value:newVal.toDay,
						type:'day'
					}
				this.$store.dispatch('getOnlinePay',toDay);
				this.$store.dispatch('getOnlinePay',pastWeek);
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
		'day-charts': dayCharts,
		'condition-query': conditionQuery,
		'range-charts': rangeCharts,
		'situation-panel':situationPanel,
		'response-time-pie': responseTimePie,
		'retry-times-pie': retryTimesPie,		
	},
	mounted () {
		this.interval= setInterval(() => {
			let params={
				value: this.queryParam.toDay,
				type: 'day'				
			}
			this.$store.dispatch('getNetworkResult',params);
		}, 600000);
	 },
	beforeDestroy () {
		clearInterval(this.interval)
    }	   
}
</script>