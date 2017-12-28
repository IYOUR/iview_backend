<style scoped>
	.situation-item .number{
		text-align: center;
		font-size: 30px;
		padding: 10px;
	}
    .situation-item .title{
        padding-left: 4px;
        font-size: 12px;
        white-space: nowrap;
    }
	.situation-item .number{
        white-space: nowrap;
		font-size: 30px;
	}
    .state{
        font-size: 20px;
        color: #19be6b;
        position: relative;
        bottom: 3px;        
    }
    .success{
        color: #19be6b;
    }
    .fail{
        color: #ed3f14;
    }    
</style>
<template>
    <Row type="flex" justify="space-between" class="code-row-bg">
        <Col span="3" v-for="(item,idx) in realTimeSituation" :key="idx">
            <div class="situation-item">
                <p class="title">{{item.title}}:</p>
                <p class="number">
                    <span> {{item.num}}</span>
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
                ws : null,
                realTimeSituation: [
                    {
                        title:'实时支付请求总次数',
                        num: '00000'
                    },
                    {
                        title:'实时返回账单成功总次数',
                        num: '00000'
                    },
                    {
                        title:'实时返回账单失败总次数',
                        num: '00000',
                    },
                    {
                        title:'实时发起支付总次数',
                        num: '00000'
                    },
                    {
                        title:'实时支付成功总次数',
                        num: '00000'
                    },   
                    {
                        title:'实时未支付成功总次数',
                        num: '00000'
                    },                                                                    	        															
                ],  
            }
        },
        computed: {
            isShowPanel: function() {
                return this.$route.path==='/realTimeData'?true:false;
            },
            ...mapState({
                queryParam: 'queryParam',
            }),	                       
        }, 
        watch: {
            'queryParam':{
                deep:true,
                handler:function(newVal,oldVal){
                    let param = {
                        cat: newVal.toDay.url.replace('day','').split('/')[0],
                        code: parseInt(this.queryParam.toDay.url.replace('day','').split('/')[1])
                    }                    
                    this.ws.send(JSON.stringify(param));
                },
            }
        },
        mounted () {
            this.socket()
        },
        methods: {
            socket() {
                if (window.WebSocket){
                    //this.ws = new WebSocket('ws:/180.97.80.42:8792');
                    this.ws = new WebSocket('ws://idata.parkingwang.com:8792');
                } else {
                    console.log("This browser does not support WebSocket.");
                }
                this.ws.onopen = ()=>{
                    let param = {
                        cat: this.queryParam.toDay.url.replace('day','').split('/')[0],
                        code: parseInt(this.queryParam.toDay.url.replace('day','').split('/')[1])
                    }
                    //console.log(JSON.stringify(param))
                    this.ws.send(JSON.stringify(param));
                };      
                this.ws.onmessage = (event) => {
                    //console.log(event.data)
                    this.showResult(JSON.parse(event.data))
                };
                this.ws.onerror =(event) => {
                    console.log(event);
                }; 
                this.ws.onclose =(event) => {
                    console.log('close');
                };    
            },
            showResult(res) {
                this.realTimeSituation.forEach((element,index,array)=>{
                    switch (index) {
                        case 0:
                            element.num = res.request_bill
                            break;
                        case 1:
                            element.num = res.bill_success
                            break;
                        case 2:
                            element.num = res.bill_fail
                            break;
                        case 3:
                            element.num = res.request_pay
                            break;        
                        case 4:
                            element.num = res.pay_success
                            break;     
                        case 5:
                            element.num = res.pay_fail
                            break;                                                                                                    					
                    }			
                })
            },
        },
        beforeDestroy () {
            this.ws.onclose();
            this.ws = null;
        }	                        
    }
</script>