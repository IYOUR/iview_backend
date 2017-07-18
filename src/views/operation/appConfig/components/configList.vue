<template>
    <div>
        <Table border :columns="columns" :data="data"></Table>
        <Tree @on-check-change="getSelect" :data="baseData" show-checkbox></Tree>
            <Collapse>
        <Panel name="1">
            <Tag>标签一</Tag>
            <Tag>标签二</Tag>
        <p slot="content">
            <Tree @on-check-change="getSelect" :data="baseData" show-checkbox></Tree>
        </p>   
        </Panel>
        <Panel name="2">
            斯蒂夫·盖瑞·沃兹尼亚克
            <p slot="content">斯蒂夫·盖瑞·沃兹尼亚克（Stephen Gary Wozniak），美国电脑工程师，曾与史蒂夫·乔布斯合伙创立苹果电脑（今之苹果公司）。斯蒂夫·盖瑞·沃兹尼亚克曾就读于美国科罗拉多大学，后转学入美国著名高等学府加州大学伯克利分校（UC Berkeley）并获得电机工程及计算机（EECS）本科学位（1987年）。</p>
        </Panel>
        <Panel name="3">
            乔纳森·伊夫
            <p slot="content">乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人。</p>
        </Panel>
    </Collapse>
        <Row>
        <Col span="6">col-6</Col>
        <Col span="6">col-6</Col>
        <Col span="6">col-6</Col>
        <Col span="6">col-6</Col>
    </Row>
        <Row>
        <Col span="6">col-6</Col>
        <Col span="6">col-6</Col>
        <Col span="6">col-6</Col>
        <Col span="6">col-6</Col>
    </Row>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                                baseData: [{
                    expand: true,
                    title: 'parent 1',
                    value:'23432',
                    children: [{
                        title: 'parent 1-0',
                        expand: true,
                        children: [{
                            title: 'leaf',
                        }, {
                            title: 'leaf',
                        }]
                    }, {
                        title: 'parent 1-1',
                        expand: true,
                        children: [{
                            title: 'leaf',
                        }]
                    }]
                }],
                columns: [
                    {
                        title: '版本名称',
                        key: 'name'
                    },
                    {
                        title: '产品线',
                        key: 'productLine'
                    },
                    {
                        title: '版本号',
                        key: 'version'
                    },
                    {
                        title: '覆盖版本范围',
                        key: 'versionRange'
                    },
                    {
                        title: 'MD5值',
                        key: 'MD5'
                    },
                    {
                        title: '白名单',
                        key: 'whiteList'
                    },   
                    {
                        title: '推荐策略',
                        key: 'recomPolicy'
                    },  
                    {
                        title: '弹窗策略',
                        key: 'Popup'
                    },  
                    {
                        title: '推荐地区',
                        key: 'recomAddress'
                    },   
                    {
                        title: '添加时间',
                        key: 'addTimes'
                    },  
                    {
                        title: '状态',
                        key: 'state'
                    },                                                                                                                                                              
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.index)
                                        }
                                    }
                                }, '查看'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                data: []
            }
        },
        methods: {
            show(index) {
                this.$Modal.info({
                    title: '用户信息',
                    content: `姓名：${this.data6[index].name}<br>年龄：${this.data6[index].age}<br>地址：${this.data6[index].address}`
                })
            },
            remove(index) {
                this.data6.splice(index, 1);
            },
            switchState(h, params) {
                return h('div', [
                    h('Button', {
                        props: {
                            type: 'primary',
                            size: 'small'
                        },
                        style: {
                            marginRight: '5px'
                        },
                        on: {
                            click: () => {
                                this.show(params.index)
                            }
                        }
                    }, '查看')
                ]);
            },
            getSelect(value) {
                console.log(value)
            }
        }
    }
</script>