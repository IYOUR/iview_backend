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
		<Table v-show="isHidden" border :columns="situationTable.columns" :data="situationTable.data" ref="table"></Table>	
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
                queryResult: 'queryResult',
                situationTable: 'situationTable'
            }),	                       
        }, 
        watch: {
            'queryResult':{
                deep:true,
                handler:function(newVal,oldVal){
                    this.handleTableData(newVal.pastWeek);
                },
            }
        },        
        methods: {
            //导出数据
            exportData () {
                this.$refs.table.exportCsv({
                    filename: this.csvName
                });
            },
            handleTableData(res) {
                let tableShowData = Object.assign({}, res.data),rowData = [];

                for(let item in tableShowData) {
                    let raw = {
                        date:tableShowData[item].date,
                        dedup_finish:tableShowData[item].dedup_finish,
                        finish:tableShowData[item].finish,
                        charge:this.isInvaild(tableShowData[item].charge/100),
                        averageCharge:this.isInvaild(tableShowData[item].charge/tableShowData[item].dedup_finish/100),
                        eachCharge:this.isInvaild(tableShowData[item].charge/tableShowData[item].finish/100),
                        space:tableShowData[item].space,
                        parks:tableShowData[item].parks,
                    }
                    rowData.push(raw);
                }
                this.situationTable.data = rowData;
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