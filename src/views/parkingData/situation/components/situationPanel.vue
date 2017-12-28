<style scoped>
	.situation-item .number{
		text-align: center;
		font-size: 30px;
		padding: 10px;
	}
    .situation-item .title{
        padding-left: 4px;
    }    
	.situation-item .comparison{
        white-space: nowrap;
		font-size: 9px;
	}
    .up{
        color: #ed3f14;
    }
    .down{
        color: #19be6b;
    }
    .no,.same{
        color: #657180;
    }
</style>
<template>
    <Row type="flex" justify="space-between" class="code-row-bg">
        <Col span="4" v-for="(item,idx) in situationData" :key="idx">
            <div class="situation-item">
                <p class="title">{{item.title}}:</p>
                <p class="number"><span>{{item.num}}</span></p>
                <p class="comparison">
                    <Row v-if="!isShowPanel" type="flex" justify="space-around" class="code-row-bg">
                        <Col span="11">
                            <table>
                                <tr>
                                    <td>前一天:</td>
                                    <td>{{item.lastDay[0]}}</td>
                                </tr>
                                <tr>
                                    <td>上一周:</td>
                                    <td>{{item.lastWeek[0]}}</td>
                                </tr>
                                <tr>
                                    <td>上一月:</td>
                                    <td>{{item.lastMonth[0]}}</td>
                                </tr>																		
                            </table>								
                        </Col>
                        <Col span="11">
                            <table style="float:right;">
                                <tr>
                                    <td>环比:</td>
                                        <td :class="item.lastDay[1].state">
                                        {{item.lastDay[1].val}}
                                        <Icon :type="item.lastDay[1].icon"></Icon>
                                    </td>
                                </tr>
                                <tr>
                                    <td>同比:</td>
                                    <td :class="item.lastWeek[1].state">
                                        {{item.lastWeek[1].val}}
                                        <Icon :type="item.lastWeek[1].icon"></Icon>
                                    </td>
                                </tr>
                                <tr>
                                    <td>同比:</td>
                                    <td :class="item.lastMonth[1].state">
                                        {{item.lastMonth[1].val}}
                                        <Icon :type="item.lastMonth[1].icon"></Icon>
                                    </td>
                                </tr>																		
                            </table>								
                        </Col>
                    </Row>	
                </p>
            </div>
        </Col>
    </Row>
</template>
<script>
	import {mapState, mapActions, mapGetters} from 'vuex';

    export default {
        data (){
            return {

            }
        },
        computed: {
            isShowPanel: function() {
                return this.$route.path==='/realTimeData'?true:false;
            },
            ...mapState({
                queryResult: 'queryResult',
                situationData: 'situationData',
                queryParam: 'queryParam'
            }),	                       
        }, 
        watch: {
            'queryResult':{
                deep:true,
                handler:function(newVal,oldVal){
                    this.showResult(newVal);
                },
            }
        },
        methods: {
            showResult(res) {
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
                let defaultDay,lastDay,lastWeek,lastMonth,
                    defaultDayLength=res.defaultDay.data.length,
                    lastDayLength=res.lastDay.data.length,
                    lastWeekLength=res.lastWeek.data.length,
                    lastMonthLength=res.lastMonth.data.length;              			
                if (item === 'charge'){
                    defaultDay = (res.defaultDay.data.length>0) ? this.isInvaild(res.defaultDay.data[defaultDayLength-1][item]/100):'暂无';
                    lastDay =  (res.lastDay.data.length>0) ? this.isInvaild(res.lastDay.data[lastDayLength-1][item]/100):'暂无';
                    lastWeek =  (res.lastWeek.data.length>0) ? this.isInvaild(res.lastWeek.data[lastWeekLength-1][item]/100):'暂无';
                    lastMonth =  (res.lastMonth.data.length>0) ? this.isInvaild(res.lastMonth.data[lastMonthLength-1][item]/100):'暂无';

                    array[index].num = isNaN(defaultDay)?defaultDay:`￥${defaultDay}`;
                    array[index].lastDay = [lastDay,this.checkResultData(defaultDay,lastDay)];
                    array[index].lastWeek = [lastWeek,this.checkResultData(defaultDay,lastWeek)];
                    array[index].lastMonth = [lastMonth,this.checkResultData(defaultDay,lastMonth)];			
                }
                else if (item === 'average') {
                    defaultDay = (res.defaultDay.data.length>0) ? this.isInvaild(res.defaultDay.data[defaultDayLength-1].charge/res.defaultDay.data[defaultDayLength-1].dedup_charge_outs/100):'暂无';
                    lastDay =  (res.lastDay.data.length>0) ? this.isInvaild(res.lastDay.data[lastDayLength-1].charge/res.lastDay.data[lastDayLength-1].dedup_charge_outs/100):'暂无';
                    lastWeek =  (res.lastWeek.data.length>0) ? this.isInvaild(res.lastWeek.data[lastWeekLength-1].charge/res.lastWeek.data[lastWeekLength-1].dedup_charge_outs/100):'暂无';
                    lastMonth =  (res.lastMonth.data.length>0) ? this.isInvaild(res.lastMonth.data[lastMonthLength-1].charge/res.lastMonth.data[lastMonthLength-1].dedup_charge_outs/100):'暂无';
                    
                    array[index].num = isNaN(defaultDay)?defaultDay:`￥${defaultDay}`;
                    array[index].lastDay = [lastDay,this.checkResultData(defaultDay,lastDay)];
                    array[index].lastWeek = [lastWeek,this.checkResultData(defaultDay,lastWeek)];
                    array[index].lastMonth = [lastMonth,this.checkResultData(defaultDay,lastMonth)];
                }
                else{
                    defaultDay = defaultDayLength>0 ? res.defaultDay.data[defaultDayLength-1][item]:'暂无';
                    lastDay = lastDayLength>0 ? res.lastDay.data[lastDayLength-1][item]:'暂无';
                    lastWeek = lastWeekLength>0 ? res.lastWeek.data[lastWeekLength-1][item]:'暂无';
                    lastMonth = lastMonthLength>0 ? res.lastMonth.data[lastMonthLength-1][item]:'暂无';

                    array[index].num = defaultDay;
                    array[index].lastDay = [lastDay,this.checkResultData(defaultDay,lastDay)];
                    array[index].lastWeek = [lastWeek,this.checkResultData(defaultDay,lastWeek)];
                    array[index].lastMonth = [lastMonth,this.checkResultData(defaultDay,lastMonth)];	
                }
            
            },
            //返回数据格式校验
            checkResultData(firstVal,secondVal) {
                if (!isFinite(firstVal/secondVal)) {
                    return {val:'暂无',state:'no',icon:''};
                }
                else if(firstVal === secondVal) {
                    return {val:'持平',state:'same',icon:'arrow-right-c'};
                }
                else if (parseFloat(firstVal)>parseFloat(secondVal)) {
                    return {val:`${(Math.abs(firstVal-secondVal)/secondVal*100).toFixed(1)}%`,state:'up',icon:'arrow-up-c'};
                }
                else{
                    return {val:`${(Math.abs(firstVal-secondVal)/secondVal*100).toFixed(1)}%`,state:'down',icon:'arrow-down-c'};
                }
            },
            isInvaild(val) {
                if(!isFinite(val)) {
                    return "0"
                }
                //let data = Math.round(val).toString().replace(/(?=(?!(\b))(\d{3})+$)/g,",")
                let data = Math.round(val)
                return `￥${data}`;
            },              
        }
               
    }
</script>