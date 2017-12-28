<style scoped>
	.situation-item .number{
		text-align: center;
		font-size: 30px;
		padding: 10px;
	}
    .situation-item .title{
        padding-left: 4px;
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
        <Col span="6" v-for="(item,idx) in realTimeSituation" :key="idx">
            <div class="situation-item">
                <p class="title">{{item.title}}:</p>
                <p v-if="item.state=='link'" class="number">
                    <router-link to="/errordetail"> {{item.num}}</router-link>
                </p>                   
                <p v-else class="number">
                    {{item.num}}
                    <span v-if="item.state=='success'" class="success state ">(成功)</span>
                    <span v-if="item.state=='fail'" class="fail state">(失败)</span>
                </p>              
            </div>
        </Col>
    </Row>
</template>
<script>
import {mapState, mapActions, mapGetters} from 'vuex';
import DateFormat from '../../../../commons/utils/formatDate.js';

    export default {
        data (){
            return {
                ws : null,
                realTimeSituation: [
                    {
                        title:'今日下发总次数',
                        num: '00000',
                        state:'',	

                    },
                    {
                        title:'今日下发成功总次数',
                        num: '00000',
                        state:'',	

                    },
                    {
                        title:'今日下发失败总次数',
                        num: '00000',
                        state:'link',	

                    },
                    {
                        title:'最近一次下发时间',
                        num: '00000',
                        state:'',	

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
                            element.num = res.success+res.fail+res.timeout
                            break;
                        case 1:
                            element.num = res.success
                            break;
                        case 2:
                            element.num = res.fail+res.timeout
                            break;
                        case 3:
                            element.num = (res.lasttime===0)?'暂无':DateFormat.format(new Date(res.lasttime * 1000), 'hh:mm:ss');
                            element.state = res.last
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