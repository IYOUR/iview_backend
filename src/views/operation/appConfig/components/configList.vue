<style scoped>
    .page{
        float:right;
        margin-top:20px;
        margin-bottom: 100px;
    }
    .modelfoot{
        display: none !important;
    }
    .defaultBtn{
        color: #2d8cf0;
        padding: 0;
    }
    .deleteBtn{
        color: #ed3f14;
        padding: 0;
    }
    .deleteBtn:hover{
        color: #ed3f14;
    }
    table.gridtable {
        font-family: verdana,arial,sans-serif;
        font-size:11px;
        width: 100%;
        color:#333333;
        border-width: 1px;
        border-color: #e9eaec;
        border-collapse: collapse;
    }
    table.gridtable th {
        border-width: 1px;
        padding: 8px;
        border-style: solid;
        border-color: #e9eaec;
        background-color: #f8f8f9;
    }
    table.gridtable td {
        border-width: 1px;
        padding: 8px;
        border-style: solid;
        border-color: #e9eaec;
        background-color: #ffffff;
    }    
    .action {
        min-width: 200px;
        text-align: center;
    }
    .action .api{
        max-height: 500px;
    }
    .planTable{
        border: 1px solid #dddee1;
        border-collapse: collapse;   
        border-radius: 4px; 
        padding: 5px;
        width: 100%;
        text-align:left;  
    } 
    .tableHit {
        text-align: center;
        padding-top: 5px;
        border: 1px solid #e9eaec;
    }     
</style>
<template>
<div>
    <Row type="flex" justify="center">
        <Col span="23">
            <table class="gridtable">
                <thead>
                    <tr>
                        <th v-for="(item,index) in configTable.columns">{{item.title}}</th>                                            
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in configTable.data">
                        <td>{{item.name}}</td>
                        <td>{{item.productLine}}</td>
                        <td>{{item.version}}</td>
                        <td>{{item.versionRange}}</td>
                        <td>{{item.md5}}</td>
                        <td>{{item.appType}}</td>
                        <td>{{item.recomPolicy}}</td>
                        <td>{{item.popup}}</td>
                        <td>{{item.networkType}}</td>
                        <td>{{item.addTimes}}</td>
                        <td>
                            <span @click.capture="statusConfirm($event,item,index)">
                                <i-switch :value="item.status">
                                    <span slot="open">开</span>
                                    <span slot="close">关</span>
                                </i-switch>  
                            </span>                      
                        </td>
                        <td class="action">
                            <Poptip placement="bottom-end" width="600" @on-popper-hide="changeShowPlan">
                                <Button class="defaultBtn" @click="getUpdatePlan(item.id)" type="text">更新计划</Button>
                                <div class="api" slot="content">
                                    <Spin v-show="!showPlan" fix>加载中...</Spin>
                                    <div v-show="showPlan">
                                        <table class="planTable" v-if="planTable">
                                            <th v-for="(item,index) in updatePlan.columns">{{item.title}}</th>      
                                            <tr v-for="(items,idx) in updatePlanSort">
                                                <td class="time">{{items.time}}</td>
                                                <td class="area">{{items.areaStr}}</td>
                                                <td class="user">{{items.user}}</td>
                                            </tr>															
                                        </table>
                                        <p v-if="!planTable">暂无更新计划...</p>	
                                    </div>
                                </div>
                            </Poptip> 
                            <Button class="defaultBtn" @click="editConfig({state:true,val:item})" type="text">编辑</Button>
                            <Button class="defaultBtn" @click="showEidtHistory(item.id)"type="text">修改日志</Button>
                            <Button class="deleteBtn" @click="deleteConfig({id:item.id,idx:index})" type="text">删除</Button>                       
                        </td>
                    </tr>
                </tbody>
            </table>
            <p v-if="configTable.data.length==0" class="tableHit">暂无数据...</p>           
            <div class="page">
                <Page :total="totalPage" @on-change="nextPage"></Page>
            </div>
        </Col>

    </Row>
    <Modal title="修改日志" v-model="editHistory.state">
       
        <Table border height="300" :columns="editHistory.columns" :data="editHistory.data"></Table>
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
                   size: 10 
                },
                showPlan:false,
                updatePlan: {
                    ellipsis: true,
                    columns: [
                        {
                            title: '时间',
                            key: 'time'
                        },
                        {
                            title: '地区',
                            key: 'areaStr'
                        },
                        {
                            title: '用户',
                            key: 'user'
                        }                       
                    ],
                    data:[]                    
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
                            key: 'time',
                            width:'160'
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
                            title: '终端',
                            key: 'appType'
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
                            title: '网络环境',
                            key: 'networkType'
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
            },
            'updatePlan':{
                deep:true,
                handler:function(newVal,oldVal){
                    this.showPlan = true;
                },
            },            
        },          
        created () {
            this.getAppConfig(this.page)
        }, 
        computed: {
            ...mapState({
                editConfigData: 'editConfigData',
                configEditTime: 'configEditTime',
                previewInfo: 'previewInfo',
            }),	
            planTable () {
                return (this.updatePlan.data.length==0)?false:true;
            },
            updatePlanSort () {
                return this.updatePlan.data.sort((first,second)=>{
                    return DateFormat.compareDate(DateFormat.formatToDate(first.time),DateFormat.formatToDate(second.time))
                })
            },	              
        },
        methods: {
            nextPage (value) {
                this.page.pagenum = value;
                this.getAppConfig(this.page);
            },   
            changeShowPlan () {
                this.showPlan = false;
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
            // 获取更新计划信息 
            getUpdatePlan (params) {
                let param = {app_info_id:params};
                return operationService.getUpdatePlan(param).then(res => {
                    if(res.status ==200 && res.data.message=='ok'){
                        if(res.data.data.length>0){
                            this.showEditPlan(res.data.data)
                        }else{
                            this.updatePlan.data = [];
                        }
                    } else{
                        this.$Message.error(res.data.message);
                    }
                });
            },   
            //展示编辑状态下的更新计划
            showEditPlan (data) {
                let plan = [];
                for(let item in data) {
                    this.getAreaName(data[item].region).then((res)=>{
                        let singePlan={},arrStr = [];
                        singePlan.id = data[item].id;
                        singePlan.time = data[item].time;
                        singePlan.user = (data[item].white_list=='')?'全部':data[item].white_list;
                        singePlan.area = res;
                        for(let item in res){
                            arrStr.push(res[item].label);
                            if(res[item].value == '100000'){
                                arrStr=['全国']; 
                            }   
                        }
                        singePlan.areaStr = arrStr.join(',');
                        plan.push(singePlan)
                        this.updatePlan.data = plan;
                    });
                }
            },
            //根据地区value值获取对应名称        
            getAreaName (params) {
                let param = {ids:params};
                return operationService.getAreaName(param).then(res => {
                    if(res.status ==200 && res.data.message=='ok'){
                        return res.data.data;          
                    } 
                    else{
                        this.$Message.error(res.data.message);
                    }
                });
            },                           
            transitionList (type,val) {
                switch (type) {
                    case 'appType':
                        if(val == 0) {
                            return 'Android'
                        }
                        if(val == 1) {
                            return 'IOS'
                        }
                    break;     
                    case 'networkType':
                        if(val == 0) {
                            return '移动网络'
                        }
                        if(val == 1) {
                            return 'WIFI'
                        }
                        if(val == 2) {
                            return '移动网络和WIFI'
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
                        update_content:'更新内容',status:'状态',filename:'文件名',network_type:'网络类型',
                }
                for(let i in arr){
                    if(arr[i]!=='filesize' && arr[i]!=='url'){
                        str.push(content[arr[i]])
                    }
                }
                return str.join(',');
            },   
            statusConfirm (e,params,idx) {
                e.stopImmediatePropagation();
                this.$Modal.confirm({
                    title: '确认更改状态',
                    content: '<p>确认要更改此条配置信息状态么?</p>',
                    onOk: () => {
                        this.setConfigStatus (params,idx);
                    },
                    onCancel: () => {
                        return
                    }
                });                  
            }, 
            //状态切换                 
            setConfigStatus (params,idx) {
                let data = Object.assign({}, params);
                data.status = !data.status
                this.configTable.data.splice(idx, 1, data);
                let param = {id:parseInt(params.id),status:Number(data.status)}
                return operationService.setConfigStatus(param).then(res => {
                    if(res.status ==200 && res.data.message=='ok'){
                        this.$Message.success('状态更改成功');
                    } else{
                        this.$Message.error(res.data.message);
                    }
                });
            },  
            //编辑 
            editConfig (val) {
                this.$store.commit('SET_EDIT_CONFIG_DATA',val); 
                this.previewInfo.state = false;
                this.$store.commit('SET_PREVIEW_STATE',this.previewInfo);
            }, 
            //删除   
            deleteConfig (params) {  
                if(this.editConfigData.state && this.editConfigData.val.id==params.id){
                    this.$Message.warning('此条配置信息正处于编辑状态，请提交或取消后重试！');
                    return
                }
                this.$Modal.confirm({
                    title: '确认删除',
                    content: '<p>确认要删除此条配置信息么?</p>',
                    onOk: () => {
                        return operationService.deleteConfig(params.id).then(res => {
                            if(res.status ==200 && res.data.message=='ok'){
                                this.configTable.data.splice(params.idx, 1);
                                this.$Message.success('删除成功');
                                if(this.configTable.data.length==0){
                                    this.$store.commit('SET_CONFIG_CONFIG_TIME',new Date());
                                }
                            } else{
                                this.$Message.error(res.data.message);
                            }
                        });
                    },
                    onCancel: () => {
                        return
                    }
                });  
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
                        app_type: tableShowData[item].app_type,
                        name: tableShowData[item].versionname,
                        productLine: tableShowData[item].product_line,
                        version: tableShowData[item].versioncode,
                        versionRange: `${tableShowData[item].version_min}~${tableShowData[item].version_max}`,
                        md5: tableShowData[item].md5,
                        appType: this.transitionList('appType',tableShowData[item].app_type),
                        recomPolicy: this.transitionList('recomPolicy',tableShowData[item].update_type),
                        popup: this.transitionList('popup',tableShowData[item].popup_type),
                        networkType:this.transitionList('networkType',tableShowData[item].network_type),
                        addTimes: tableShowData[item].ctime,
                        status: Boolean(tableShowData[item].status),
                        id: tableShowData[item].id,
                        version_max: tableShowData[item].version_max,
                        version_min: tableShowData[item].version_min,
                        product_line: tableShowData[item].product_line,
                        update_type: tableShowData[item].update_type,
                        popup_type: tableShowData[item].popup_type,
                        network_type: tableShowData[item].network_type,
                        filename: tableShowData[item].filename,
                        filesize: tableShowData[item].filesize,
                        versionname: tableShowData[item].versionname,
                        versioncode: tableShowData[item].versioncode,
                        update_content: tableShowData[item].update_content,
                        id: tableShowData[item].id,
                        url: tableShowData[item].url,
                    }
                    rowData.push(raw);
                }
                this.configTable.data = rowData;
            },
            //处理修改日志数据
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
        }
    }
</script>