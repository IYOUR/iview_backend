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
		<parking-table></parking-table>
	</div>
</div> 
</template>

<script>
	import tabCharts from './components/tabCharts.vue'
	import conditionQuery from '../../../components/parkingData/conditionQuery.vue'
	import parkingTable from './components/parkingTable.vue'
	import situationPanel from './components/situationPanel.vue'
	import * as situationService from '../../../api/situation';
	import axios from 'axios';
	import CONSTANT from '../../../commons/utils/code';
	import {mapState, mapActions, mapGetters} from 'vuex';
export default {

	data (){
		return {
		}
	},
	watch:{
		'queryParam':{
			deep:true,
			handler:function(newVal,oldVal){
				this.$store.dispatch('getQueryResult',newVal)
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
		'situation-panel':situationPanel
	}  
}
</script>