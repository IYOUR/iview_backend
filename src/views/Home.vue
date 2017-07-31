<style scoped>
    .layout{
        background: #f5f7f9;
        position: relative;
        overflow: hidden;
        height: 100%;
    }
    .layout-breadcrumb{
        padding: 10px 15px 0;
    }
    .layout-content{
        min-height: 200px;
        margin: 15px;
        overflow: auto;
        background: #fff;
        border-radius: 4px;
        height: 87%;
    }
    .layout-content-main{
        padding: 10px;
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
    .layout-menu-left{
        background: #464c5b;
        min-width:120px;
    }
    .layout-menu-left ul{
        height: 100%;
    }
    .layout-container-right{
       overflow:hidden;
    }
    .layout-header{
        height: 60px;
        background: #fff;
     
    }
    .header-title{
       font-size: 20px; 
       color: rgba(45,140,240,.9);
       line-height: 60px;
       padding-left: 15px;

    }
    .layout-logo-left{
        width: 100%;
        height: 60px;
        line-height: 60px;
        font-size: 28px;
        text-align: center;
    }
    .layout-logo-left img{
        max-width: 100%;
        padding: 15px;
    }
    .layout-ceiling-main a{
        color: #9ba7b5;
    }
    .layout-hide-text .layout-text{
        display: none;
    }
    .ivu-col{
        transition: width .2s ease-in-out;
    }
    .ivu-row-flex{
        height: 100%;
    }
    .userinfo{
        height: 60px;
        width: 25%;
        font-size: 14px;
        line-height: 60px;
        text-align: center;
        padding-right: 15px;
        display: inline-block;
        float: right;
    }
    .userinfo .iconfont{
        font-size: 14px;
    }
    .userinfo span{
        cursor: pointer;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;        
    }
    .userinfo i{
        padding-right: 3px;
    }
    .ivu-menu-submenu-title{
        padding: 14px;
    }
    .menu-item-child{
        font-size: 13px;
    }
 
</style>
<template>
    <div class="layout">
        <Row type="flex">
            <i-col span="3" :xs="9" :sm="7" :md="5" :lg="3" class="layout-menu-left">
                <Menu :mode="modeType" theme="dark" width="auto" :active-name="this.$route.path" :open-names="openNames" @on-select="menuSelect" accordion>
                     <div class="layout-logo-left">
                         <img src="../assets/images/IOP logo@3X.png" alt="图片无法正常加载。请刷新重试！">
                     </div>
                   <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">  
                        <Submenu :name="item.name" v-if="!item.leaf">
                            <template slot="title">
                                <span class="layout-text" >{{item.name}}</span>
                            </template>
                            <template v-for="(child,childIndex) in item.children" v-if="!child.hidden">
                                <Menu-item class="menu-item-child" :name="child.path">{{child.name}}</Menu-item>
                            </template>
                        </Submenu>
                       
                   </template>
                </Menu>
            </i-col>
            <i-col span="21" :xs="15" :sm="17" :md="19" :lg="21" class="layout-container-right">
                <div class="layout-header">
                    <span class="header-title">iData经营分析平台</span>
                    <div class="userinfo">
                        <Row>
                            <Col span="10">
                                <div>
                                    <span><i class="iconfont irain-yonghu"></i>{{userInfo.nickName}}</span>
                                </div>
                            </Col>
                            <Col span="8">
                                <div>
                                    <span @click="modifyPassWord"><i class="iconfont irain-shezhi2"></i>修改密码</span>
                                </div>
                            </Col>
                            <Col span="6">
                                <div>
                                    <span @click="logout"><i class="iconfont irain-exit"></i>注销</span>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
                <!-- <div class="layout-breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb-item href="#">应用中心</Breadcrumb-item>
                        <Breadcrumb-item>{{$route.name}}</Breadcrumb-item>
                    </Breadcrumb>
                </div> -->
                <div class="layout-content">
                        <router-view></router-view>
                </div>
            </i-col>
        </Row>

          <Modal v-model="passwordModel" title="修改密码或昵称" :loading="loading" @on-ok="comfirmModify"  @on-cancel="cancel" >
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                <Form-item label="昵称" prop="nickName">
                    <Input v-model="formValidate.nickName" placeholder="请输入昵称"></Input>
                </Form-item>            
                <Form-item label="原密码" prop="oldPassword">
                    <Input v-model="formValidate.oldPassword" type="password" placeholder="请输入原始密码"></Input>
                </Form-item>
                <Form-item label="新密码" prop="newPassword">
                    <Input v-model="formValidate.newPassword" type="password" placeholder="请输入新密码"></Input>
                </Form-item>
                 <Form-item label="确认新密码" prop="resetPassword">
                    <Input v-model="formValidate.resetPassword" type="password" placeholder="请再次输入新密码"></Input>
                </Form-item>
            </Form>
        </Modal>
    </div>
    <!-- 修改密码 模态框 -->
  
<!-- 修改密码 模态框 -->
</template>

<script>
import * as userService from '../api/user';
    export default {
        data () {
            
            return {
                openNames: [this.$route.matched[0].name],
                curUserName : sessionStorage.getItem('user').replace(/\"/g, ""),
                modeType: "vertical",
                spanLeft: 3,
                spanRight: 21,
                logoIsDisplay: false,
                loading: true,
                passwordModel: false,
                formValidate: {
                    nickName: '',
                    oldPassword: '',
                    newPassword: '',
                    resetPassword:''
                },             
                ruleValidate: {
                    nickName: [
                        { required: true, message: '昵称不能为空', trigger: 'blur' },
                        { type: 'string', min: 2, message: '昵称长度不能小于2位', trigger: 'blur' },
                        { type: 'string', max: 10, message: '昵称长度不能大于10位', trigger: 'blur' }
                    ],                    
                    oldPassword: [
                        { required: true, message: '密码不能为空', trigger: 'blur' }
                    ],
                    newPassword: [
                        { required: true, message: '密码不能为空', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
                    ],
                    resetPassword: [
                        { validator: this.validatePassCheck, trigger: 'blur' }
                    ],
                }
            }
        },
        computed: {
            iconSize () {
                return this.spanLeft === 5 ? 14 : 24;
            },
            logoSize(){
                if(this.spanLeft !== 5){
                    this.logoIsDisplay = true;
                    return 30;
                }else{
                    this.logoIsDisplay = false;
                    return 0;
                }
            },
            userInfo () {
                return JSON.parse(sessionStorage.getItem('userInfo'));
            }
        },
        methods: {
            validatePassCheck (rule, value, callback) {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.formValidate.newPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            },               
            modifyPassWord() {
                this.formValidate.nickName = this.userInfo.nickName;
                this.passwordModel = true;    
            },
            logout() {
                this.$router.push('/login');
            },
            comfirmModify() {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        let param = {
                            userName: this.userInfo.userName,
                            val:{
                                nickname: this.formValidate.nickName,
                                password: this.formValidate.newPassword,
                                oldpassword: this.formValidate.oldPassword
                            }
                        };
                        this.setPassword(param);
                    } else {
                        this.$Message.error('表单验证失败!');
                        this.passwordModel = false;
                    }
                })    
            },
            cancel(){
                this.passwordModel = false;
                this.$refs.formValidate.resetFields();
            },
            menuSelect(name) {
                 this.$router.push({ path: name });
            },
            setPassword (params) {
                return userService.setPassword(params).then(res => {
                    if(res.status ==200 && res.data.message=='ok'){
                        this.$Message.success('修改成功!');
                        this.userInfo.nickName = params.val.nickname;
                        sessionStorage.setItem('user', JSON.stringify(this.userInfo));
                        this.cancel();
                    } else{
                        this.passwordModel = false;
                        this.$Message.error(res.data.message);
                    }
                });
            },                
          
        },
        mounted(){
        }
    }
</script>