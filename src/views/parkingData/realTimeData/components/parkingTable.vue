<style scoped>
    .tableButton{
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
	import {mapState, mapActions, mapGetters} from 'vuex';
    import DateFormat from '../../../../commons/utils/formatDate.js';
    export default {
        data (){
            return {
                isHidden: true,              
            }
        },
        computed: {
            isShowPanel: function() {
                return this.$route.path==='/realTimeData'?true:false;
            },
            ...mapState({
                currentResult: 'currentResult',
                realTimeTable: 'realTimeTable'
            }),	                       
        }, 
        watch: {
            'currentResult':{
                deep:true,
                handler:function(newVal,oldVal){
                    this.handleTableData(newVal.toDay);
                },
            }
        },        
        methods: {
            //导出数据
            exportData () {
                this.$refs.table.exportCsv({
                    filename: '数据'
                });
            },
            handleTableData(res) {
                let tableShowData = Object.assign([], res.data),rowData = [];
                for(let i=0;i<tableShowData.length;i++) {
                    let raw = {
                        date:DateFormat.format(DateFormat.formatToDate (tableShowData[i].date), 'hh:mm'),
                        ins:tableShowData[i].ins,
                        outs:tableShowData[i].outs,
                        in_parks:tableShowData[i].in_parks,
                        in_parks:tableShowData[i].in_parks,
                        space_ratio:tableShowData[i].space_ratio,
                        charge:(tableShowData[i].ins/100).toFixed(2),
                        in_parks:tableShowData[i].in_parks,
                    }
                    rowData.push(raw);
                }
                this.realTimeTable.data = rowData;
            }                    
        }        
    }
</script>