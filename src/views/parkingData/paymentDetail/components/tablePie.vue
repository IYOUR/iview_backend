<style scoped>

</style>
<template>
    <Tabs type="card">
        <Tab-pane label="图表">
            <div id="chartPie" style="width:100%; height:400px;"></div>
        </Tab-pane>
        <Button type="ghost" size="small" slot="extra">导出Excel</Button>
        <Tab-pane label="表格">
            <Table border :columns="columns" :data="data"></Table></Tab-pane>
    </Tabs>
</template>
<script>
import echarts from 'echarts'
    export default {
        // props: {
        //     tabItem: {
        //     type: Array,
        //     required: true
        //     }
        // },
        data (){
            return {
                chartPie:null,
                columns: [
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
                data: []
            }
        },        
        mounted:function(){
            this.chartPie = echarts.init(document.getElementById('chartPie'));
            this.chartPie.setOption({
                title : {
                    text: 'Pie Chart',
                    subtext: '纯属虚构',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['停车王','支付宝','微信','现金','银联']
                },
                series : [
                    {
                        name: '支付渠道',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                            {value:335, name:'停车王'},
                            {value:310, name:'支付宝'},
                            {value:234, name:'微信'},
                            {value:135, name:'现金'},
                            {value:1548, name:'银联'}
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            });
        }
    }
</script>