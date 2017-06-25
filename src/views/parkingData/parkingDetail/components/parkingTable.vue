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
            isShowPanel: function() {
                return this.$route.path==='/realTimeData'?true:false;
            },
            ...mapState({
                parkDetailData: 'parkDetailData',
                parkDetailTable: 'parkDetailTable'
            }),	                       
        }, 
        watch: {
            'parkDetailData':{
                deep:true,
                handler:function(newVal,oldVal){
                    this.handleTableData(newVal);
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
                    console.log(tableShowData)
                for(let item in tableShowData) {
                    let raw = {
                        date:tableShowData[item].date,
                        ins:tableShowData[item].ins,
                        outs:tableShowData[item].outs,
                        pass_nights:tableShowData[item].pass_nights,
                        maxRatio:tableShowData[item].ins,
                        minRatio:tableShowData[item].ins,
                        space_ratio:tableShowData[item].space_ratio,
                        averageTime:tableShowData[item].ins,
                        inOutPerhour:tableShowData[item].ins,
                        increased:tableShowData[item].ins,
                    }
                    rowData.push(raw);
                }
                console.log(rowData)
                this.parkDetailTable.data = rowData;
            }                    
        }        
    }
</script>