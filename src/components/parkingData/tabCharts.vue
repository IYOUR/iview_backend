<style scoped>
.parkingTimes .headTitle{
    height: 60px;
    line-height: 60px;
    text-align: center;
}
.parkingTimes .hint{
    height: 60px;
    line-height: 60px;
    text-align: center;
}
.hint button{
    width: 115px;
}
.parkingTable{
    padding: 15px;
    margin-top: 30px;
}
.datePicker{
    width: 115px;
    margin:0 auto;
}
</style>
<template>
    <Tabs type="card">
        <Tab-pane :label="item" v-for="item in tabItems" class="parkingTimes">
             <Row>
                <Col span="5">
                    <div class="headTitle"><span>{{item}}</span></div>
                </Col>
                <Col span="5" offset="14">
                    <div class="hint">
                        <Poptip trigger="hover" title="提示标题" content="一天之内完成的停车总数"  placement="left">
                            <Button><Icon type="ios-help-outline"></Icon>指标定义</Button>
                        </Poptip>        
                    </div>
                    <Date-picker v-if="datePicker" class="datePicker" type="date" placement="bottom-end" placeholder="选择日期"></Date-picker> 
                </Col>
            </Row>
            <div id="chartLine" style="width:100%; height:400px;"></div>       
        </Tab-pane>
    </Tabs>
</template>
<script>
import echarts from 'echarts'
    export default {
        props: {
            tabItem: {
            type: Array,
            required: true
            }
        },
        data (){
            return {
                tabItems: this.tabItem,
                chartLine: null,
                columns1: [
                    {
                        title: '姓名',
                        key: 'name'
                    },
                    {
                        title: '年龄',
                        key: 'age'
                    },
                    {
                        title: '地址',
                        key: 'address'
                    }
                ],
                data1: [
                    {
                        name: '王小明',
                        age: 18,
                        address: '北京市朝阳区芍药居'
                    },
                    {
                        name: '张小刚',
                        age: 25,
                        address: '北京市海淀区西二旗'
                    },
                    {
                        name: '李小红',
                        age: 30,
                        address: '上海市浦东新区世纪大道'
                    },
                    {
                        name: '周小伟',
                        age: 26,
                        address: '深圳市南山区深南大道'
                    }
                ]
            }
        },  
        computed: {
            datePicker: function() {
                return this.$route.path==='/realTimeData'?true:false;
            }
        },    
        mounted:function(){
            var _this=this;
            this.chartLine = echarts.init(document.getElementById('chartLine'));
            this.chartLine.setOption({
                title: {
                    text: ''
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['搜索引擎']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['周一','周二','周三','周四','周五','周六','周日']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name:'搜索引擎',
                        type:'line',
                        stack: '总量',
                        data:[820, 932, 901, 934, 1290, 1330, 1320]
                    }
                ]
            });
        }
    }
</script>