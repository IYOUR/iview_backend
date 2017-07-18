<style scoped>
    .tableButton{
        margin-top: 15px;
        margin-bottom: 15px;
    }
</style>
<template>
	<div>
		<Row class="tableButton">
			<Col span="2" offset="20">
				<Button type="ghost" @click="isHidden = !isHidden" v-if="isHidden">隐藏表格</Button>
                <Button type="ghost" @click="isHidden = !isHidden" v-if="!isHidden">显示表格</Button>
			</Col>
			<Col span="2">
				<Button type="primary" @click="exportData">导出CSV</Button>
			</Col>
		</Row>
		<Table v-show="isHidden" border :columns="realTimeTable.columns" :data="realTimeTable.data" ref="table"></Table>	
	</div>
</template>
<script>
	import {mapState, mapActions} from 'vuex';
    import DateFormat from '../../../../commons/utils/formatDate.js';
    export default {
        data (){
            return {
                isHidden: true,              
            }
        },
        computed: {
            csvName: function() {
                return this.$route.name;
            },
            ...mapState({
                queryParam: 'queryParam',
                currentResult: 'currentResult',
                realTimeTable: 'realTimeTable'
            }),	                                   
        }, 
        watch: {
            'currentResult':{
                deep:true,
                handler:function(newVal,oldVal){
                    this.handleTableData(newVal.allResult.toDay);
                },
            },
            'currentResult.dateResult':{
                deep:true,
                handler:function(newVal,oldVal){
                    this.handleTableData(newVal);
                },    
            },              
        },        
        methods: {
            //导出数据
            exportData () {
                this.$refs.table.exportCsv({
                    filename: `${this.csvName}(${this.exportDate()})`
                });
            },
            //导出时间
            exportDate () {
                let date = DateFormat.format(DateFormat.formatToDate(this.queryParam.toDay.param.date), 'MM-dd')
                return `${date}`;
            },
            handleTableData(res) {
                let tableShowData = Object.assign([], res.data),rowData = [];
                for(let i=0;i<tableShowData.length;i++) {
                    let raw = {
                        date:DateFormat.format(DateFormat.formatToDate (tableShowData[i].date), 'hh:mm'),
                        ins:tableShowData[i].ins,
                        outs:tableShowData[i].outs,
                        in_parks:tableShowData[i].in_parks,
                        space_ratio:`${tableShowData[i].space_ratio.toFixed(2)}%`,
                        charge:this.isInvaild(tableShowData[i].charge/100),
                        new:tableShowData[i].new,
                    }
                    rowData.push(raw);
                }
                this.realTimeTable.data = rowData;
            },
            isInvaild(val) {
                if(!isFinite(val)) {
                    return '￥0.00'
                }
                return `￥${val.toFixed(2)}`
            }                                  
        }        
    }
</script>