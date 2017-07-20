<style scoped>
    .page{
        float:right;
        margin-top:20px;
    }
    .modelfoot{
        display: none !important;
    }
</style>
<template>
<div>
    <Row type="flex" justify="center">
        <Col span="23">
            <Table border :columns="configTable.columns" :data="configTable.data"></Table>
            <div class="page">
                <Page :total="totalPage" @on-change="nextPage"></Page>
            </div>
        </Col>

    </Row>
    <Modal v-model="editHistory.state">
        <Table border :columns="editHistory.columns" :data="editHistory.data"></Table>
        <div slot="footer"></div>
    </Modal>
</div>
</template>
<script>
import * as operationService from '../../../../api/operation';
import CONSTANT from '../../../../commons/utils/code';
import DateFormat from '../../../../commons/utils/formatDate';
import {mapState, mapActions, mapGetters} from 'vuex';
    export default {
        data () {
            return {
                totalPage: 0,
                page: {
                   pagenum: 1,
                   size: 5 
                },
                editHistory: {
                    scroll: true,
                    state: false,
                    columns: [
                        {
                            title: '用户昵称',
                            key: 'username'
                        },
                        {
                            title: '操作时间',
                            key: 'time'
                        },
                        {
                            title: '操作方式',
                            key: 'action'
                        },
                        {
                            title: '操作内容',
                            key: 'content'
                        },                        
                    ],
                    data:[]
                },
                configTable: {
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
                            key: 'md5'
                        },  
                        {
                            title: '推荐策略',
                            key: 'recomPolicy'
                        },  
                        {
                            title: '弹窗策略',
                            key: 'popup'
                        },    
                        {
                            title: '添加时间',
                            key: 'addTimes'
                        },  
                        {
                            title: '状态',
                            key: 'state',
                            render: this.switchState
                        },                                                                                                                                                              
                        {
                            title: '操作',
                            key: 'action',
                            width: 200,
                            align: 'center',
                            render: this.operation
                        }
                    ],
                    data: []
                },
            }
        },
        watch: {
            'configEditTime':{
                handler:function(newVal,oldVal){
                    this.getAppConfig(this.page);
                },
            }
        },          
        created () {
            this.getAppConfig(this.page)
        }, 
        computed: {
            ...mapState({
                editConfigData: 'editConfigData',
                configEditTime: 'configEditTime',
            }),	
        },
        methods: {
            nextPage (value) {
                this.page.pagenum = value;
                this.getAppConfig(this.page);
            },
            show(value) {
               console.log(value) 
            },
            ok () {
                this.$Message.info('点击了确定');
            },            
            //获取配置信息
            getAppConfig (params) {
                return operationService.getAppConfig(params).then((res) => {
                    if(res.status ==200 && res.data.message=='ok'){
                        this.showTableData(res.data.data.infos);
                        this.totalPage = res.data.data.total*10;
                    } else{
                        this.$Message.error(res.data.message);
                    }
                });
            }, 
            transitionList (type,val) {
                switch (type) {
                    case 'productLine':
                        if(val == 0) {
                            return 'KOP'
                        }
                        if(val == 1) {
                            return 'ECP'
                        }
                        if(val == 2) {
                            return 'IOP'
                        }
                    break;
                    case 'recomPolicy':
                        if(val == 0) {
                            return '推荐更新'
                        }
                        if(val == 1) {
                            return '强制更新'
                        }
                    break;
                    case 'popup':
                        if(val == 0) {
                            return '每次启动弹窗'
                        }
                        if(val == 1) {
                            return '每天弹窗一次'
                        }
                        if(val == 2) {
                            return '不弹窗'
                        }
                    break;                                        
                }

            },
            transitionHistory (type,val) {
                switch (type) {
                    case 'action':
                        if(val == 0) {
                            return '添加'
                        }
                        if(val == 1) {
                            return '删除'
                        }
                        if(val == 2) {
                            return '修改'
                        }
                    break;
                }
            },  
            //将对应的字段转换为汉字值  
            transitionContent (val) {
                let arr = val.split(','),str=[];
                let content = {
                        appInfo:'配置信息',updatePlan:'更新计划',versionname:'版本名',
                        versioncode:'版本号',version_max:'覆盖版本上限',version_min:'覆盖版本下限',
                        md5:'md5',product_line:'产品线',update_type:'更新类型',popup_type:'弹窗类型',
                        update_content:'更新内容',status:'状态',filename:'文件名'
                }
                for(let i in arr){
                    str.push(content[arr[i]])
                }
                return str.join(',');
            },                     
            setConfigStatus (params) {
               let param = {id:parseInt(params.id),status:Number(params.status)}
                return operationService.setConfigStatus(param).then(res => {
                    if(res.status ==200 && res.data.message=='ok'){
                        this.$Message.success('状态更改成功');
                    } else{
                        this.$Message.error(res.data.message);
                    }
                });
            },       
            deleteConfig (params) {  
                return operationService.deleteConfig(params.id).then(res => {
                    if(res.status ==200 && res.data.message=='ok'){
                        this.configTable.data.splice(params.idx, 1);
                        this.$Message.success('删除成功');
                    } else{
                        this.$Message.error(res.data.message);
                    }
                });
            },              
            remove(index) {
                this.data6.splice(index, 1);
            },
            showEidtHistory (params) {
                let param = {app_info_id:params};
                return operationService.getEditHistory(param).then(res => {
                    if(res.status ==200 && res.data.message=='ok'){
                        this.showEditHistoryData(res.data.data);
                        this.editHistory.state = true;
                    } else{
                        this.$Message.error(res.data.message);
                    }
                });
            },              
            // 处理表格显示数据
            showTableData (res) {
                let tableShowData = Object.assign({}, res),rowData = [];
                for(let item in tableShowData) {
                    let raw = {
                        name: tableShowData[item].versionname,
                        productLine: this.transitionList('productLine',tableShowData[item].product_line),
                        version: tableShowData[item].versioncode,
                        versionRange: `${tableShowData[item].version_min}~${tableShowData[item].version_max}`,
                        md5: tableShowData[item].md5,
                        recomPolicy: this.transitionList('recomPolicy',tableShowData[item].update_type),
                        popup: this.transitionList('popup',tableShowData[item].popup_type),
                        addTimes: tableShowData[item].ctime,
                        status: Boolean(tableShowData[item].status),
                        id: tableShowData[item].id,
                        version_max: tableShowData[item].version_max,
                        version_min: tableShowData[item].version_min,
                        product_line: tableShowData[item].product_line,
                        update_type: tableShowData[item].update_type,
                        popup_type: tableShowData[item].popup_type,
                        filename: tableShowData[item].filename,
                        versionname: tableShowData[item].versionname,
                        versioncode: tableShowData[item].versioncode,
                        update_content: tableShowData[item].update_content,
                        id: tableShowData[item].id,
                    }
                    rowData.push(raw);
                }
                this.configTable.data = rowData;
            },
            showEditHistoryData (res) {
                let tableShowData = Object.assign({}, res),rowData = [];
                for(let item in tableShowData) {
                    let raw = {
                        username: tableShowData[item].username,
                        time: tableShowData[item].time,
                        action: this.transitionHistory('action',tableShowData[item].action),
                        content: this.transitionContent(tableShowData[item].content),
                    }
                    rowData.push(raw);
                }
                this.editHistory.data = rowData;
            },            
            switchState(h, params) {
                return h('div', [
                            h('i-switch', {
                                props: {
                                    value: params.row.status,
                                },
                                style: {
                                    'text-align': 'center'
                                },                                
                                on: {
                                    'on-change': (value) => {
                                        this.setConfigStatus({id:params.row.id,status:value})
                                    }
                                }
                            }, )
                        ]);
            },
            operation (h, params) {
                return h('div', [
                    h('Button', {
                        props: {
                            type: 'text',
                            size: 'small'
                        },
                        style: {
                            'color': '#2d8cf0'
                        },                          
                        on: {
                            click: () => {
                                this.$store.commit('SET_EDIT_CONFIG_DATA',{state:true,val:params.row});
                            }
                        }
                    }, '编辑'),
                    // h('Button', {
                    //     props: {
                    //         type: 'text',
                    //         size: 'small',
                    //     },
                    //     style: {
                    //         'color': '#2d8cf0'
                    //     },                          
                    //     on: {
                    //         click: () => {
                                
                    //         }
                    //     }
                    // }, '更新计划'),
                    h('Button', {
                        props: {
                            type: 'text',
                            size: 'small',
                        },
                        style: {
                            'color': '#2d8cf0'
                        },                          
                        on: {
                            click: () => {
                                this.showEidtHistory(params.row.id)
                            }
                        }
                    }, '修改日志'),
                    h('Button', {
                        props: {
                            type: 'text',
                            size: 'small',
                        },
                        style: {
                            'color': '#ed3f14'
                        },                          
                        on: {
                            click: () => {
                                this.$Modal.confirm({
                                    title: '确认要删除',
                                    content: '<p>确认要删除此条配置信息么?</p>',
                                    onOk: () => {
                                         this.deleteConfig({id:params.row.id,idx:params.index})
                                    },
                                    onCancel: () => {
                                        return
                                    }
                                });     
                            }
                        }
                    }, '删除'),                                        
                ]);
            },            
            getSelect(value) {
                console.log(value)
            }
        }
    }
</script>