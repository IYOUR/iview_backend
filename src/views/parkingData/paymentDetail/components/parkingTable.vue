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
                paymentDetailData: 'paymentDetailData',
                paymentDetailTable: 'paymentDetailTable'
            })                                
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
                    filename: `${this.csvName}(${this.exportDate()})`
                });
            },
            //导出时间
            exportDate () {
                let sdate = DateFormat.format(DateFormat.formatToDate(this.queryParam.pastWeek.param.sdate), 'MM-dd'),
                    edate = DateFormat.format(DateFormat.formatToDate(this.queryParam.pastWeek.param.edate), 'MM-dd');
                return `${sdate}_${edate}`;
            },
            handleTableData(res) {
                let tableShowData = Object.assign({}, res),rowData = [];

                for(let item in tableShowData) {
                    let raw = {
                        date:tableShowData[item].date,
                        charge:this.isInvaild(tableShowData[item].charge/100,'charge'),
                        eachTimesPay:this.isInvaild(tableShowData[item].charge/tableShowData[item].finish/100,'charge'),
                        eachCarPay:this.isInvaild(tableShowData[item].charge/tableShowData[item].dedup_finish/100,'charge'),
                        spaceWorth:this.isInvaild(tableShowData[item].charge/tableShowData[item].space/100,'charge'),
                        averageTime:this.isInvaild(tableShowData[item].parking_duration/tableShowData[item].finish/60,'finish'),
                        inOutPerhour:this.isInvaild((tableShowData[item].ins+tableShowData[item].outs)/24,'outs'),
                    }
                    rowData.push(raw);
                }
                this.paymentDetailTable.data = rowData;
            },
            isInvaild(val,type) {
                if(type == 'charge') {
                    if(!isFinite(val)) {
                        return '￥0.00'
                    }
                    return `￥${val.toFixed(2) }`               
                }
                else {
                    if(!isFinite(val)) {
                        return '0'
                    }
                    return val.toFixed(2)         
                }
            }                                
        }        
    }
</script>