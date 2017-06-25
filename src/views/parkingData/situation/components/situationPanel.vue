<style scoped>
	.situation-item .number{
		text-align: center;
		font-size: 30px;
		padding: 10px;
	}
	.situation-item .comparison{
        white-space: nowrap;
		font-size: 9px;
	}
    .up{
        color: #19be6b;
    }
    .down{
        color: #ed3f14;
    }
    .no,.same{
        color: #657180;
    }
</style>
<template>
    <Row type="flex" justify="space-between" class="code-row-bg">
        <Col span="4" v-for="(item,idx) in situationData" :key="idx">
            <div class="situation-item">
                <p>{{item.title}}:</p>
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
                    <Row v-if="isShowPanel" type="flex" justify="space-around" class="code-row-bg">
                        <Col span="11">
                            <table>
                                <tr>
                                    <td>同比昨日:</td>
                                    <td>{{item.lastDay[0]}}</td>
                                </tr>												
                            </table>								
                        </Col>  
                        <Col span="11">
                            <table style="float:right;">
                                <tr>
                                    <td>变化:</td>
                                    <td :class="[(item.lastDay[2]) ? 'isup' : 'isdown']">{{item.lastDay[1]}}
                                        <Icon :type="(item.lastDay[2])? 'arrow-up-c':'arrow-down-c'"></Icon>
                                    </td>
                                </tr>																	
                            </table>								
                        </Col>                                          
                    </row>	
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
                if (item === 'charge'){
                    let defaultDay,lastDay,lastWeek,lastMonth;
                    defaultDay = (res.defaultDay.data.length>0) ? (res.defaultDay.data[0][item]/100).toFixed(2):'暂无';
                    lastDay =  (res.lastDay.data.length>0) ? (res.lastDay.data[0][item]/100).toFixed(2):'暂无';
                    lastWeek =  (res.lastWeek.data.length>0) ? (res.lastWeek.data[0][item]/100).toFixed(2):'暂无';
                    lastMonth =  (res.lastMonth.data.length>0) ? (res.lastMonth.data[0][item]/100).toFixed(2):'暂无';
                    array[index].num = defaultDay;
                    array[index].lastDay = [lastDay,this.checkResultData(defaultDay,lastDay)];
                    array[index].lastWeek = [lastWeek,this.checkResultData(defaultDay,lastWeek)];
                    array[index].lastMonth = [lastMonth,this.checkResultData(defaultDay,lastMonth)];			
                }
                else if (item === 'average') {
                    let defaultDay,lastDay,lastWeek,lastMonth;
                    defaultDay = (res.defaultDay.data.length>0) ? (res.defaultDay.data[0].charge/res.defaultDay.data[0].dedup_finish/100).toFixed(2):'暂无';
                    lastDay =  (res.lastDay.data.length>0) ? (res.lastDay.data[0].charge/res.lastDay.data[0].dedup_finish/100).toFixed(2):'暂无';
                    lastWeek =  (res.lastWeek.data.length>0) ? (res.lastWeek.data[0].charge/res.lastWeek.data[0].dedup_finish/100).toFixed(2):'暂无';
                    lastMonth =  (res.lastMonth.data.length>0) ? (res.lastMonth.data[0].charge/res.lastMonth.data[0].dedup_finish/100).toFixed(2):'暂无';
                    
                    array[index].num = defaultDay;
                    array[index].lastDay = [lastDay,this.checkResultData(defaultDay,lastDay)];
                    array[index].lastWeek = [lastWeek,this.checkResultData(defaultDay,lastWeek)];
                    array[index].lastMonth = [lastMonth,this.checkResultData(defaultDay,lastMonth)];
                }
                else{
                    let defaultDay,lastDay,lastWeek,lastMonth;
                    defaultDay = (res.defaultDay.data.length>0) ? res.defaultDay.data[0][item]:'暂无';
                    lastDay =  (res.lastDay.data.length>0) ? res.lastDay.data[0][item]:'暂无';
                    lastWeek =  (res.lastWeek.data.length>0) ? res.lastWeek.data[0][item]:'暂无';
                    lastMonth =  (res.lastMonth.data.length>0) ? res.lastMonth.data[0][item]:'暂无';

                    array[index].num = defaultDay;
                    array[index].lastDay = [lastDay,this.checkResultData(defaultDay,lastDay)];
                    array[index].lastWeek = [lastWeek,this.checkResultData(defaultDay,lastWeek)];
                    array[index].lastMonth = [lastMonth,this.checkResultData(defaultDay,lastMonth)];	
                }
            
            },
            //返回数据格式校验
            checkResultData(firstVal,secondVal) {
                if (isNaN(firstVal/secondVal)) {
                    return {val:'暂无',state:'no',icon:''};
                }
                else if(firstVal === secondVal) {
                    return {val:'持平',state:'same',icon:'arrow-right-c'};
                }
                else if (firstVal>secondVal) {
                    return {val:(firstVal/secondVal).toFixed(2),state:'up',icon:'arrow-up-c'};
                }
                else{
                    return {val:(firstVal/secondVal).toFixed(2),state:'down',icon:'arrow-down-c'};
                }
            },
        }
               
    }
</script>