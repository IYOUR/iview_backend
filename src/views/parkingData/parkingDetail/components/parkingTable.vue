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
		<Table v-show="isHidden" border :columns="parkDetailTable.columns" :data="parkDetailTable.data" ref="table"></Table>	
	</div>
</template>
<script>
	import {mapState, mapActions, mapGetters} from 'vuex';
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
                parkDetailData: 'parkDetailData',
                parkDetailTable: 'parkDetailTable'
            }),	 
            ...mapGetters({
                exportDate: 'exportCSVdate'
            })                                   
        }, 
        watch: {
            'parkDetailData':{
                deep:true,
                handler:function(newVal,oldVal){
                    this.handleTableData(newVal.tableSection);
                },
            }
        },        
        methods: {
            //导出数据
            exportData () {
                this.$refs.table.exportCsv({
                    filename: `${this.csvName}(${this.exportDate})`
                });
            },
            handleTableData(res) {
                let tableShowData = Object.assign({}, res),rowData = [];
                for(let item in tableShowData) {
                    let raw = {
                        date:tableShowData[item].date,
                        dedup_ins:tableShowData[item].dedup_ins,
                        dedup_outs:tableShowData[item].dedup_outs,
                        pass_nights:tableShowData[item].pass_nights,
                        maxRatio:`${(tableShowData[item].space_ratio_max).toFixed(2)}%`,
                        minRatio:`${(tableShowData[item].space_ratio_min).toFixed(2)}%`,
                        space_ratio:`${(tableShowData[item].space_ratio).toFixed(2)}%`,
                        averageTime:this.isInvaild(tableShowData[item].parking_duration/tableShowData[item].finish/60),
                        inOutPerhour:this.isInvaild((tableShowData[item].dedup_ins+tableShowData[item].dedup_outs)/24),
                        increased:tableShowData[item].new,
                    }
                    rowData.push(raw);
                }
                this.parkDetailTable.data = rowData;
            },
            isInvaild(val) {
                if(!isFinite(val)) {
                    return '0'
                }
                return val.toFixed(2)
            }                                   
        }        
    }
</script>