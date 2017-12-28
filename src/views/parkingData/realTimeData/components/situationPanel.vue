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
        <Col span="4" v-for="(item,idx) in realTimeSituation" :key="idx">
            <div class="situation-item">
                <p class="title">{{item.title}}:</p>
                <p class="number"><span>{{item.num}}</span></p>
                <p class="comparison">
                    <Row type="flex" justify="space-around" class="code-row-bg">
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
                                    <td :class="item.lastDay[1].state">
                                        {{item.lastDay[1].val}}
                                        <Icon :type="item.lastDay[1].icon"></Icon>
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
                currentResult: 'currentResult',
                realTimeSituation: 'realTimeSituation'
            }),	                       
        }, 
        watch: {
            'currentResult.allResult':{
                deep:true,
                handler:function(newVal,oldVal){
                    this.showResult(newVal);
                },
            }
        },
        methods: {
            showResult(res) {
                this.realTimeSituation.forEach((element,index,array)=>{
                    switch (index) {
                        case 0:
                            this.handleResultData(index,array,res,'ins')
                            break;
                        case 1:
                            this.handleResultData(index,array,res,'outs')
                            break;
                        case 2:
                            this.handleResultData(index,array,res,'in_parks')
                            break;
                        case 3:
                            this.handleResultData(index,array,res,'charge')
                            break;	
                        case 4:
                            this.handleResultData(index,array,res,'new')
                            break;                       					
                    }			
                })
            },
            //处理返回数据
            handleResultData(index,array,res,item) {	
                let toDay,lastDay,toDayLth=res.toDay.data.length,
                    lastDayLth=res.lastDay.data.length;			
                if (item === 'charge'){
                    toDay = (toDayLth>0) ? (this.counter(res.toDay.data,item,toDayLth)/100).toFixed(2):'暂无';
                    lastDay =  (toDayLth>0 && lastDayLth>=toDayLth) ? (this.counter(res.lastDay.data,item,toDayLth)/100).toFixed(2):'暂无';
                    
                    array[index].num = isNaN(toDay)?toDay:this.formatMoney(toDay);
                    array[index].lastDay = [lastDay,this.checkResultData(toDay,lastDay)];	
                }
                else if (item === 'new') {
                    toDay = (toDayLth>0) ? this.counter(res.toDay.data,item,toDayLth):'暂无';
                    lastDay =  (toDayLth>0 && lastDayLth>=toDayLth) ? this.counter(res.lastDay.data,item,toDayLth):'暂无';

                    array[index].num = toDay;
                    array[index].lastDay = [lastDay,this.checkResultData(toDay,lastDay)];
                }
                else if (item === 'in_parks') {
                    toDay = (toDayLth>0) ? res.toDay.data[toDayLth-1][item]:'暂无';
                    lastDay =  (toDayLth>0 && lastDayLth>=toDayLth) ? res.lastDay.data[toDayLth-1][item]:'暂无';
                    
                    array[index].num = toDay;
                    array[index].lastDay = [lastDay,this.checkResultData(toDay,lastDay)];
                }                
                else{
                    toDay = (toDayLth>0) ? this.counter(res.toDay.data,item,toDayLth):'暂无';
                    lastDay =  (toDayLth>0 && lastDayLth>=toDayLth) ? this.counter(res.lastDay.data,item,toDayLth):'暂无';
                    
                    array[index].num = toDay;
                    array[index].lastDay = [lastDay,this.checkResultData(toDay,lastDay)];
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
            //累加计算
            counter(arr,item,length) {
                let num = 0;
                for(let i=0;i<length;i++) {
                    num = num +arr[i][item]
                }
                return num;
            },
            formatMoney(val) {
                //let data = Math.round(val).toString().replace(/(?=(?!(\b))(\d{3})+$)/g,",")
                let data = Math.round(val)
                return `￥${data}`;
            },                 
        }
               
    }
</script>