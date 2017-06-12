<style scoped>
	.situation-item .number{
		text-align: center;
		font-size: 30px;
		padding: 10px;
	}
	.situation-item .comparison{
		font-size: 10px;;
	}
    .isup{
        color: #19be6b;
    }
    .isdown{
        color: #ed3f14;
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
                        <Col span="10">
                            <table>
                                <tr>
                                    <td>前一天:</td>
                                    <td>{{item.lastDay[0]}}</td>
                                </tr>
                                <tr>
                                    <td>同比上周:</td>
                                    <td>{{item.lastWeek[0]}}</td>
                                </tr>
                                <tr>
                                    <td>同比上月:</td>
                                    <td>{{item.lastMonth[0]}}</td>
                                </tr>																		
                            </table>								
                        </Col>
                        <Col span="10">
                            <table style="float:right;">
                                <tr>
                                    <td>环比:</td>
                                    <td :class="(item.lastDay[2]) ? 'isup' : 'isdown'">{{item.lastDay[1]}}
                                        <Icon :type="(item.lastDay[2])? 'arrow-up-c':'arrow-down-c'"></Icon>
                                    </td>
                                </tr>
                                <tr>
                                    <td>同比:</td>
                                    <td :class="[(item.lastWeek[2]) ? 'isup' : 'isdown']">{{item.lastWeek[1]}}
                                        <Icon :type="(item.lastWeek[2])? 'arrow-up-c':'arrow-down-c'"></Icon>
                                    </td>
                                </tr>
                                <tr>
                                    <td>同比:</td>
                                    <td :class="[(item.lastMonth[2]) ? 'isup' : 'isdown']">{{item.lastMonth[1]}}
                                        <Icon :type="(item.lastMonth[2])? 'arrow-up-c':'arrow-down-c'"></Icon>
                                    </td>
                                </tr>																		
                            </table>								
                        </Col>
                    </Row>	
                    <Row v-if="isShowPanel" type="flex" justify="space-around" class="code-row-bg">
                        <Col span="10">
                            <table>
                                <tr>
                                    <td>同比昨日:</td>
                                    <td>{{item.lastDay[0]}}</td>
                                </tr>												
                            </table>								
                        </Col>  
                        <Col span="10">
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

    export default {
        props: {
            situationPanelData: {
            type: Array,
            required: true
            }
        },
        data (){
            return {
                situationData: this.situationPanelData
            }
        },
        computed: {
            isShowPanel: function() {
                return this.$route.path==='/realTimeData'?true:false;
            }
        }        
    }
</script>