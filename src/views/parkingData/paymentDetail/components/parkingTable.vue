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
		<Table v-show="isHidden" border :columns="paymentDetailTable.columns" :data="paymentDetailTable.data" ref="table"></Table>	
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
            isShowPanel: function() {
                return this.$route.path==='/realTimeData'?true:false;
            },
            ...mapState({
                paymentDetailData: 'paymentDetailData',
                paymentDetailTable: 'paymentDetailTable'
            }),	                       
        }, 
        watch: {
            'paymentDetailData':{
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
                    filename: '数据'
                });
            },
            handleTableData(res) {
                let tableShowData = Object.assign({}, res),rowData = [];

                for(let item in tableShowData) {
                    let raw = {
                        date:tableShowData[item].date,
                        charge:this.isInvaild(tableShowData[item].charge/100),
                        eachTimesPay:this.isInvaild(tableShowData[item].charge/tableShowData[item].finish/100),
                        eachCarPay:this.isInvaild(tableShowData[item].charge/tableShowData[item].dedup_finish/100),
                        spaceWorth:this.isInvaild(tableShowData[item].charge/tableShowData[item].space/100),
                        averageTime:this.isInvaild(tableShowData[item].parking_duration/tableShowData[item].finish/60),
                        inOutPerhour:this.isInvaild((tableShowData[item].ins+tableShowData[item].outs)/24),
                    }
                    rowData.push(raw);
                }
                this.paymentDetailTable.data = rowData;
            },
            isInvaild(val) {
                if(isNaN(val)) {
                    return '0'
                }
                return val.toFixed(2)
            }                                
        }        
    }
</script>