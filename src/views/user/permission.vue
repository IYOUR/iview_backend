<style scoped lang="less">
	.layout-content-permission{
		padding: 15px;
        .title{
            font-size: 16px;
            line-height: 60px;
        }
        .head{
            height: 60px;
        }
        .add_btn{
            float: right;
            line-height: 60px;
        }
        .table{
            margin-top: 20px;
            .table_btn{
                margin: 2px;
            }
        }
    }
    .modal{
        padding: 30px 30px 0px 30px;
    }
    .submit{
        text-align: center;
        .btn{
            width: 150px;
        }
    }
</style>
<template>
	<div class="layout-content-permission">
        <Row class="head">
            <Col span="4">
                <p class="title">账号列表</p>
            </Col>
            <Col span="4" offset="16">
                <span class="add_btn">
                    <Button @click="activeModal" type="primary">添加账号</Button>
                </span>
                
            </Col>
        </Row>
        <hr class="line"></hr>
        <Table class="table" border :columns="tableData.columns" :data="tableData.data"></Table> 

        <!--模态框-->
        <Modal style="padding:35px;" v-model="showModal" @on-cancel="closeModal('userInfo')" :mask-closable="false" :scrollable="true" width="700">
            <div class="modal">
                <Row>
                    <Col span="16" offset="1">
                        <Form ref="userInfo" :model="userInfo":rules="ruleValidate" label-position="right" :label-width="80">
                            <FormItem label="账号:" prop="account">
                                <Input v-model="userInfo.account"></Input>
                            </FormItem>
                            <FormItem label="姓名:" prop="name">
                                <Input v-model="userInfo.name"></Input>
                            </FormItem>                        
                            <FormItem label="密码:" prop="passwd">
                                <Input v-model="userInfo.passwd"></Input>
                            </FormItem>
                            <FormItem label="功能权限:" prop="feature">
                                <CheckboxGroup v-model="userInfo.feature">
                                    <Checkbox label="parkingData">停车数据</Checkbox>
                                    <Checkbox label="clientSituation">车主数据</Checkbox>
                                    <Checkbox label="operation">平台运营</Checkbox>
                                    <Checkbox label="performance">性能监控</Checkbox>
                                    <Checkbox label="repository">数据仓库</Checkbox>
                                </CheckboxGroup>
                            </FormItem>                            
                        </Form>                
                    </Col>
                </Row>
                <Row>
                    <Col span="18" offset="1">
                        <Form label-position="right" :label-width="80">
                            <FormItem label="数据权限:">
                                <Select v-model="userInfo.company" placeholder="请选择集团（默认为全部）" multiple :filterable="true" :transfer="true" placement="top">
                                    <Option v-for="item in companyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="">
                                <Select v-model="userInfo.park" placeholder="请选择车场（默认为全部）" multiple :filterable="true" :transfer="true" placement="top">
                                    <Option value="null" v-if="!showPark" disabled>暂无数据</Option>
                                    <Option v-if="showPark" v-for="item in parkList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>                        
                        </Form>                
                    </Col>
                </Row>         
            </div>
            <div slot="footer" class="submit">
                <span>
                    <Button class="btn" type="primary" @click="handleSubmit('userInfo')" size="large">提交</Button>
                </span>
            </div>
        </Modal>             
	</div>
</template>

<script>
import {mapState, mapActions, mapGetters} from 'vuex';
import * as userService from '../../api/user';
import {getParkList} from '../../api/situation';
import CONSTANT from '../../commons/utils/code';
    export default {
        data () {
            return {
                showModal: false,
                editStaus: false,
                old_username: '',
                userInfo: {
                    account: '',
                    name: '',
                    passwd: '',
                    feature: [],
                    company: [],
                    park: [],
                },  
                showPark:false,
                tempParklist: [],
                lastCompanyCode: [],
                ruleValidate: {
                    account: [
                        { required: true, message: '账号不能为空', trigger: 'blur' },
                        { type: 'string', min: 2, message: '账号不能少于2个字符', trigger: 'blur' },
                        { type: 'string', max: 12, message: '账号不能多于35个字符', trigger: 'blur' },                         
                    ],
                    name: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' },
                        { type: 'string', min: 2, message: '姓名不能少于2个字符', trigger: 'blur' },
                        { type: 'string', max: 6, message: '姓名不能多于6个字符', trigger: 'blur' },                        
                    ],
                    passwd: [
                        { required: true, message: '密码不能为空', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码不能少于6个字符', trigger: 'blur' },
                        { type: 'string', max: 12, message: '密码不能多于12个字符', trigger: 'blur' },
                    ],
                    feature: [
                        { required: true, type: 'array', min: 1, message: '至少选择一个功能', trigger: 'change' },
                    ],                    
                },
                tableData: {
                    columns: [
                        {
                            title: '姓名',
                            key: 'nickname'
                        },
                        {
                            title: '账号',
                            key: 'account'
                        },
                        {
                            title: '功能权限',
                            key: 'feature_permission'
                        },
                        {
                            title: '集团权限',
                            key: 'data_group' 
                        },
                        {
                            title: '车场权限',
                            key: 'data_park' 
                        },                        	
                        {
                            title: '添加人',
                            key: 'adder' 
                        },
                        {
                            title: '状态',
                            width: '50',
                            key: 'status',                          
                        },
                        {
                            title: '操作',
                            width: '210',
                            align: 'center',
                            render: (h, params) => {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'success',
                                            size: 'small',
                                        },
                                        style: {
                                            width:'50px',
                                            marginLeft: '5px',
                                        },
                                        on: {
                                            click: () => {
                                                this.editAccount(params.row)
                                            }
                                        }
                                    }, '修改'),
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small',
                                        },
                                        style: {
                                            width:'50px',
                                            marginLeft: '5px',
                                        },
                                        on: {
                                            click: () => {
                                                this.deleteAccount(params.row.account)
                                            }
                                        }
                                    }, '删除'),
                                    h('Button', {
                                        props: {
                                            type: (params.row.is_delete=='0')?'primary':'warning',
                                            size: 'small',
                                        },
                                        style: {
                                            width:'50px',
                                            marginLeft: '5px',
                                        },
                                        on: {
                                            click: () => {
                                                this.disableAccount(params.row)
                                            }
                                        }
                                    }, (params.row.is_delete=='0')?'封禁':'解封'),                                                                                                        
                                ]);
                            }                             
                        }                                                                              									
                    ],
                    data: []
                },                                    
            }
        },
        computed: {
            ...mapState({
                companyList: 'companyList',
            }),
            parkList () {
                let result = [];
                for(let i in this.tempParklist){
                    if(result.indexOf(JSON.stringify(this.tempParklist[i]))==-1){
                        result.push(JSON.stringify(this.tempParklist[i]))
                    }                    
                }
                return result.map((ele)=>{return JSON.parse(ele)})
            },          
        },
        watch: {
            'userInfo.company':{
                deep: true,
                handler(newVal,oldVal){
                    if(newVal.length==0 && this.showModal){
                        this.lastCompanyCode = [];
                        this.tempParklist = [];
                        this.userInfo.park = [];
                        return
                    }
                    if(this.lastCompanyCode.length>newVal.length && this.showModal){
                        let diff = this.lastCompanyCode.filter(function(i) {return newVal.indexOf(i) < 0;});
                        this.findCancelPark({park:this.userInfo.park,val:diff})
                        this.tempParklist = [];
                    }
                    this.lastCompanyCode = Object.assign([], newVal);
                    this.getAllPark(newVal)
                },
            },
            'editStaus':{
                handler(newVal,oldVal){
                    
                    if(newVal){
                        this.ruleValidate.passwd[0].required=false;
                    }else{
                        this.ruleValidate.passwd[0].required=true;
                    } 
                },                
            },
            'parkList':{
                immediate: true,
                handler(newVal,oldVal){
                    if(newVal.length>0) {
                        this.showPark = true;
                    } else 
                    this.showPark = false;
                },
            },            
        },
        mounted(){     
            this.getAccount();
        },        
        methods: {
            activeModal () {
                this.showModal = true;
                this.editStaus = false;
            },            
            getAccount() {
                return userService.getAccount().then(res => {
                    if (res.status != CONSTANT.HTTP_STATUS.SUCCESS.CODE) {
                        this.$Message.error(res.message || CONSTANT.HTTP_STATUS.SERVER_ERROR.MSG);
                        return;
                    }; 
                    this.handleTable(res.data)
                });
            },	
            getAllPark (data) {
                for(let i in data){
                    getParkList({company:data[i]}).then(res => {
                        if (res.status != CONSTANT.HTTP_STATUS.SUCCESS.CODE) {
                            this.$Message.error(res.message || CONSTANT.HTTP_STATUS.SERVER_ERROR.MSG);
                            return;
                        }; 
                        this.tempParklist = this.tempParklist.concat(res.data.data);
                    });
                }
            }, 
            //剔除掉取消选择集团得车场
            findCancelPark (data) {
                getParkList({company:data.val}).then(res => {
                    if (res.status != CONSTANT.HTTP_STATUS.SUCCESS.CODE) {
                        this.$Message.error(res.message || CONSTANT.HTTP_STATUS.SERVER_ERROR.MSG);
                        return;
                    }; 
                    let park = res.data.data,
                        nowPark = Object.assign([], data.park);
                    for(let i in park){
                        for(let j in nowPark){
                            if(park[j].value==data.park[i]){
                                nowPark.splice(j, 1)
                            }
                        }
                    }
                    setTimeout(()=>{
                        this.userInfo.park = nowPark
                    },100)
                });                
            },
            handleTable(res) {
                let tableShowData = Object.assign([], res.data),rowData = [];
                for(let i=0;i<tableShowData.length;i++) {
                    if(!tableShowData[i].adder==0){
                        let row = {
                            nickname:tableShowData[i].nickname,
                            account:tableShowData[i].username,
                            feature_permission: this.filterName({type:'table',val:tableShowData[i].auth}).join(','),
                            data_group: this.handleDataPmssion({type:'group',val:tableShowData[i].auth_cid}),
                            data_park: this.handleDataPmssion({type:'park',val:tableShowData[i].auth_park_code}),
                            auth:tableShowData[i].auth,
                            adder:this.filterAdder({id:tableShowData[i].adder,val:tableShowData}),
                            status:(tableShowData[i].is_delete==0)?'正常':'封禁',
                            auth_cid: this.filterArr(tableShowData[i].auth_cid),
                            auth_park_code: this.filterArr(tableShowData[i].auth_park_code), 
                            is_delete: tableShowData[i].is_delete                        
                        }
                        rowData.push(row);
                    }

                }
                this.tableData.data = rowData;
            },

            filterArr (data) {
                if(data.length==0){
                    return []
                }
                let arr = data.split(',');
                return arr.map((ele)=>{
                    return parseInt(ele)
                })
            },
            filterAdder (data) {
                for(let i=0;i<data.val.length;i++) {  
                    if(data.val[i].id == data.id){
                        return data.val[i].nickname
                    }
                }              
            },
            //提取出功能权限路由
            handleRoutes(data) {
                let feature = data, router = this.$router.options.routes, arr=[];
                for(let i in feature){
                    for(let j in router){
                        if(feature[i]===router[j].name){
                            let item = {
                                name: router[j].name,
                                text: router[j].text,
                                children: []
                            }
                            if(router[j].children && router[j].children.length>0){
                                for(let k in router[j].children){
                                    item.children.push({
                                        name:router[j].children[k].name,
                                        text:router[j].children[k].text,
                                        hidden:router[j].children[k].hidden,
                                    })
                                }
                            }
                            arr.push(item)
                        }
                    }
                }
                return JSON.stringify(arr)
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let params = {
                            username: this.userInfo.account,
                            nickname: this.userInfo.name,
                            password: this.userInfo.passwd,
                            auth: this.handleRoutes(this.userInfo.feature),
                            auth_cid: this.userInfo.company.join(','),
                            auth_park_code: this.userInfo.park.join(','),
                        }
                        //判断编辑还是修改
                        if(!this.editStaus){
                            userService.addAccount(params).then(res => {
                                if (res.status != CONSTANT.HTTP_STATUS.SUCCESS.CODE) {
                                    this.$Message.error(res.message || CONSTANT.HTTP_STATUS.SERVER_ERROR.MSG);
                                    return;
                                };
                                if(res.data.message==='ok') {
                                    this.$Message.success('添加账号成功');
                                    this.showModal = false;
                                    this.closeModal('userInfo');
                                    this.editStaus = false;
                                    this.getAccount();
                                }else
                                this.$Message.error(res.data.message);

                            });
                        } else{
                            params.old_username = this.old_username;
                            userService.editAccount(params).then(res => {
                                if (res.status != CONSTANT.HTTP_STATUS.SUCCESS.CODE) {
                                    this.$Message.error(res.message || CONSTANT.HTTP_STATUS.SERVER_ERROR.MSG);
                                    return;
                                };
                                if(res.data.message==='ok') {
                                    this.$Message.success('修改账号成功');
                                    this.showModal = false;
                                    this.closeModal('userInfo');
                                    this.editStaus = false;
                                    this.getAccount();
                                }else
                                this.$Message.error(res.data.message);

                            });                            
                        }

                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            closeModal (name) {
                this.$refs[name].resetFields();
                this.userInfo.company = [];
                this.userInfo.park = [];
                this.getAccount();
            },
            //修改
            editAccount (data) {
                this.userInfo={
                    account: data.account,
                    name: data.nickname,
                    passwd: '',
                    feature: this.filterName({type:'form',val:data.auth}),
                    company: data.auth_cid,
                    park: data.auth_park_code,                  
                }
                this.old_username = data.account;
                this.editStaus = true;
                this.showModal = true;
            },
            filterName (data) {
                let feature = JSON.parse(data.val),arr=[];
                for(let i in feature){
                    if(data.type=='table'){
                        arr.push(feature[i].text)
                    }
                    if(data.type=='form'){
                        arr.push(feature[i].name)
                    }
                    
                }
                return arr
            },
            //删除用户
            deleteAccount (data) {
                this.$Modal.confirm({
                    title: '确认删除',
                    content: '<p>确认要删除此账号么?</p>',
                    onOk: () => {
                        userService.deleteAccount(data).then(res => {
                            if (res.status != CONSTANT.HTTP_STATUS.SUCCESS.CODE) {
                                this.$Message.error(res.message || CONSTANT.HTTP_STATUS.SERVER_ERROR.MSG);
                                return;
                            };
                            if(res.data.message==='ok') {
                                this.getAccount();
                                this.$Message.success('删除账号成功');
                            }else
                            this.$Message.error(res.data.message);

                        });                          
                    },
                    onCancel: () => {
                        return
                    }
                });                    

            },
            //封禁用户
            disableAccount (data) {
                if(data.is_delete=='0'){
                    userService.disableAccount({username:data.account}).then(res => {
                        if (res.status != CONSTANT.HTTP_STATUS.SUCCESS.CODE) {
                            this.$Message.error(res.message || CONSTANT.HTTP_STATUS.SERVER_ERROR.MSG);
                            return;
                        };
                        if(res.data.message==='ok') {
                            this.getAccount();
                            this.$Message.success('封禁账号成功');
                        }else
                        this.$Message.error(res.data.message);

                    });  
                }else{
                    userService.enableAccount({username:data.account}).then(res => {
                        if (res.status != CONSTANT.HTTP_STATUS.SUCCESS.CODE) {
                            this.$Message.error(res.message || CONSTANT.HTTP_STATUS.SERVER_ERROR.MSG);
                            return;
                        };
                        if(res.data.message==='ok') {
                            this.getAccount();
                            this.$Message.success('解封账号成功');
                        }else
                        this.$Message.error(res.data.message);

                    });  
                }
            },
            //处理表格数据权限显示 
            handleDataPmssion (data) {
                if(data.val.length==0){
                    return '全部'
                }
                let companyList = JSON.parse(sessionStorage.getItem('companyList')) || [],
                    parkList = JSON.parse(sessionStorage.getItem('parkList')) || [],
                    tempVal = data.val.split(','),
                    str = [];
                if(data.type=='group'){
                    for(let j in tempVal){
                        for(let i in companyList){
                            if(companyList[i].value==tempVal[j]){
                                str.push(companyList[i].label)
                            }
                        }
                    }               
                }
                if(data.type=='park'){
                    for(let j in tempVal){
                        for(let i in parkList){
                            if(parkList[i].value==tempVal[j]){
                                str.push(parkList[i].label)
                            }
                        }				
                    }
                }
                return str.join(',')   
            },            
        },

    }
</script>