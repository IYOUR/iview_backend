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
					num: '00000',
					lastDay:['00','00',true],	
					lastWeek:['00','00',true],
					lastMonth:['00','00',true]
				},
				{
					title:'停车场数量',
					num: '00000',
					lastDay:['00','00',true],	
					lastWeek:['00','00',true],
					lastMonth:['00','00',true]
				},
				{
					title:'完成停车辆数',
					num: '00000',
					lastDay:['00','00',true],	
					lastWeek:['00','00',true],
					lastMonth:['00','00',true]
				},
				{
					title:'总收入(元)',
					num: '00000',
					lastDay:['00','00',true],	
					lastWeek:['00','00',true],
					lastMonth:['00','00',true]
				},		
				{
					title:'平均每辆车付费(元)',
					num: '00000',
					lastDay:['00','00',true],	
					lastWeek:['00','00',true],
					lastMonth:['00','00',true]
				}															
			],
			tabItems:{
				tabOption:[
					{label:'完成停车数量',id:'dedup_finish'},
					{label:'完成停车次数',id:'finish'},
					{label:'总收入',id:'charge'},
					{label:'平均每辆车付费',id:'averageCharge'},
					{label:'平均每次停车付费',id:'eachCharge'},
					{label:'车位数量',id:'space'},
					{label:'停车场数量',id:'parks'}
				],
				tabChartsData:{}
				},
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
		showResult(res) {
			this.tabItems.tabChartsData = Object.assign({}, res.pastWeek);
			if (res.defaultDay.data.length === 0) {
				this.$Message.warning('暂无数据！');
				return
			}
			this.situationData.forEach((element,index,array)=>{
				switch (index) {
					case 0:
						this.handleResultData(index,array,res,'space')
						break;
					case 1:
						this.handleResultData(index,array,res,'parks')
						break;
					case 2:
						this.handleResultData(index,array,res,'dedup_finish')
						break;
					case 3:
						this.handleResultData(index,array,res,'charge')
						break;
					case 4:
						this.handleResultData(index,array,res,'average')
						break;						
				}			
			})
		},
		//处理返回数据
		handleResultData(index,array,res,item) {				
			if (item === 'charge'){
				let defaultDay,lastDay,lastWeek,lastMonth;
				defaultDay = (res.defaultDay.data.length>0) ? res.defaultDay.data[0][item]:'暂无';
				lastDay =  (res.lastDay.data.length>0) ? res.lastDay.data[0][item]:'暂无';
				lastWeek =  (res.lastWeek.data.length>0) ? res.lastWeek.data[0][item]:'暂无';
				lastMonth =  (res.lastMonth.data.length>0) ? res.lastMonth.data[0][item]:'暂无';
				array[index].num = (defaultDay/100).toFixed(2);

				array[index].lastDay = [
					(lastDay/100).toFixed(2),
					(!isNaN(defaultDay/lastDay))?(defaultDay/lastDay/100).toFixed(2):'暂无',
					(!isNaN(defaultDay/lastDay))?((defaultDay>lastDay)? true:false):null
				];
				array[index].lastWeek = [
					lastWeek,
					(!isNaN(defaultDay/lastWeek))?(defaultDay/lastWeek/100).toFixed(2):'暂无',
					(!isNaN(defaultDay/lastWeek))?((defaultDay>lastWeek)? true:false):null
				];
				array[index].lastMonth = [
					lastMonth,
					(!isNaN(defaultDay/lastMonth))?(defaultDay/lastMonth/100).toFixed(2):'暂无',
					(!isNaN(defaultDay/lastMonth))?((defaultDay>lastMonth)? true:false):null
				];			
			}
			else if (item === 'average') {
				let defaultDay,lastDay,lastWeek,lastMonth;
				defaultDay = (res.defaultDay.data.length>0) ? (res.defaultDay.data[0].charge/res.defaultDay.data[0].dedup_finish/100).toFixed(2):'暂无';
				lastDay =  (res.lastDay.data.length>0) ? (res.lastDay.data[0].charge/res.lastDay.data[0].dedup_finish/100).toFixed(2):'暂无';
				lastWeek =  (res.lastWeek.data.length>0) ? (res.lastWeek.data[0].charge/res.lastWeek.data[0].dedup_finish/100).toFixed(2):'暂无';
				lastMonth =  (res.lastMonth.data.length>0) ? (res.lastMonth.data[0].charge/res.lastMonth.data[0].dedup_finish/100).toFixed(2):'暂无';
				array[index].num = defaultDay;
			
				array[index].lastDay = [
					lastDay,
					(!isNaN(defaultDay/lastDay))?(defaultDay/lastDay).toFixed(2):'暂无',
					(!isNaN(defaultDay/lastDay))?((defaultDay>lastDay)? true:false):null
				];
				array[index].lastWeek = [
					lastWeek,
					(!isNaN(defaultDay/lastWeek))?(defaultDay/lastWeek).toFixed(2):'暂无',
					(!isNaN(defaultDay/lastWeek))?((defaultDay>lastWeek)? true:false):null
				];
				array[index].lastMonth = [
					lastMonth,
					(!isNaN(defaultDay/lastMonth))?(defaultDay/lastMonth).toFixed(2):'暂无',
					(!isNaN(defaultDay/lastMonth))?((defaultDay>lastMonth)? true:false):null
				];
			}
			else{
				let defaultDay,lastDay,lastWeek,lastMonth;
				defaultDay = (res.defaultDay.data.length>0) ? res.defaultDay.data[0][item]:'暂无';
				lastDay =  (res.lastDay.data.length>0) ? res.lastDay.data[0][item]:'暂无';
				lastWeek =  (res.lastWeek.data.length>0) ? res.lastWeek.data[0][item]:'暂无';
				lastMonth =  (res.lastMonth.data.length>0) ? res.lastMonth.data[0][item]:'暂无';
				array[index].num = defaultDay;

				array[index].lastDay = [
					lastDay,
					(!isNaN(defaultDay/lastDay))?(defaultDay/lastDay).toFixed(2):'暂无',
					(!isNaN(defaultDay/lastDay))?((defaultDay>lastDay)? true:false):null
				];
				array[index].lastWeek = [
					lastWeek,
					(!isNaN(defaultDay/lastWeek))?(defaultDay/lastWeek).toFixed(2):'暂无',
					(!isNaN(defaultDay/lastWeek))?((defaultDay>lastWeek)? true:false):null
				];
				array[index].lastMonth = [
					lastMonth,
					(!isNaN(defaultDay/lastMonth))?(defaultDay/lastMonth).toFixed(2):'暂无',
					(!isNaN(defaultDay/lastMonth))?((defaultDay>lastMonth)? true:false):null
				];	
			}
		
		},
		chartsData(res) {
			console.log(res)
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