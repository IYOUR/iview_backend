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
        width: 250px;
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
                            <Col span="8">
                                <div>
                                    <span><i class="iconfont irain-yonghu"></i>用户名</span>
                                </div>
                            </Col>
                            <Col span="10">
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

          <Modal v-model="modal1" title="修改密码" @on-ok="comfirmModifyPS"  @on-cancel="cancel" >
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                <Form-item label="原密码" prop="oldPassword">
                    <Input v-model="formValidate.oldPassword" placeholder="请输入原始密码"></Input>
                </Form-item>
                <Form-item label="新密码" prop="newPassword">
                    <Input v-model="formValidate.newPassword" placeholder="请输入新密码"></Input>
                </Form-item>
                 <Form-item label="确认新密码" prop="resetPassword">
                    <Input v-model="formValidate.resetPassword" placeholder="请再次输入新密码"></Input>
                </Form-item>
            </Form>
        </Modal>
    </div>
    <!-- 修改密码 模态框 -->
  
<!-- 修改密码 模态框 -->
</template>

<script>
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
                modal1: false,
                formValidate: {
                    oldPassword: '',
                    newPassword: '',
                    resetPassword:''
                },
                ruleValidate: {
                    oldPassword: [
                        { required: true, message: '密码不能为空', trigger: 'blur' }
                    ],
                    newPassword: [
                        { required: true, message: '密码不能为空', trigger: 'blur' }
                    ],
                    resetPassword: [
                        { required: true, message: '密码不能为空', trigger: 'blur' }
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
            }
        },
        methods: {
            modifyPassWord() {
                this.modal1 = true;    
            },
            logout() {
                this.$router.push('/login');
            },
            comfirmModifyPS() {
                return false;
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                         this.modal1 = false;
                //         this.loading = false;
                        this.$Message.success('提交成功!');
                    } else {
                        this.$Message.error('表单验证失败!');
                        return false;
                    }
                })    
               // this.$Message.info('点击了确定');
            },
            cancel(){
                this.modal1 = false;    
                this.$Message.info('点击了取消');
            },
            menuSelect(name) {
                 this.$router.push({ path: name });
            }
          
        },
        mounted(){
        }
    }
</script>