<style scoped>
    .layout-container{
        width: 100%;
        height: 100%;
        background-color: #fff;
    }
    .card-box {
        padding: 20px;
        box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);
        -moz-border-radius: 5px;
        background-clip: padding-box;
        background-color: #fff;
        margin: 30px auto;
        margin-bottom: 15px;
        width: 300px;
        border: 1px solid #dddee1;
    }
    .title {
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
    }
    .formLogin-title {
        padding-top: 50px;
        text-align: center;
        font-size: 28px;
    }
    .formLogin-title p{
        font-size: 30px;
    }
    .formLogin-title .title-line{
        width: 270px;
        height: 1px;
        margin: 0 auto;
        background: rgba(34, 34, 34, 0.03);
    }
    .login-no-bottom {
        margin-bottom: 10px;
    }
    .login-input-bottom {
        margin-bottom: 15px;
    }
    .login-input-bottom span{
        font-size: 14px;
        padding-left: 2px;
    }
    .login-input-bottom i{
        padding-right: 3px;
    }
    .footer{
        margin: 0 auto;
        width: 300px;
    }
    .footer p{
        text-align: center;
        color: #999;
    }
</style>

<template>
<div class="layout-container">  
    <div class="formLogin-title">
        <p>登录到iData</p>
        <div class="title-line"></div>
    </div>
    <Form ref="formLogin" :model="formLogin" :rules="formLoginRules" label-position="top"  class="card-box">
        <Form-item prop="username" class="login-input-bottom">
        <label><span><Icon type="android-person"></Icon>用户名</span></label>
            <i-input size="large" type="text" v-model="formLogin.username" placeholder="用户名">
            </i-input>
        </Form-item>
        <Form-item prop="password" class="login-input-bottom">
            <label><span><Icon type="android-lock"></Icon>登录密码</span></label>
            <i-input size="large" type="password" v-model="formLogin.password" @keyup.enter.native="handleSubmit('formLogin')" placeholder="密码">
            </i-input>
        </Form-item>
          <Form-item class="login-no-bottom">
            <Checkbox-group v-model="formLogin.remember">
                <Checkbox label="记住密码" name="remember"></Checkbox>
            </Checkbox-group>
        </Form-item>
        <Form-item class="login-no-bottom">
            <Button type="primary" @click="handleSubmit('formLogin')" long>登录</Button>
        </Form-item>
    </Form>
    <div class="footer">
        <p>copyright parkingwang.com 2016</p>
    </div>
</div>
</template>
<script>
    import axios from 'axios';
    import * as userService from '../api/user';
    import CONSTANT from '../commons/utils/code';
    export default {
        data () {
            return {
                formLogin: {
                    username: '',
                    password: '',
                    remember: []
                },
                formLoginRules: {
                    username: [
                        { required: true, message: '请填写用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请填写密码', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
                    ]
                },
                pwdVisibility: false
            }
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    sessionStorage.setItem('user', JSON.stringify(this.formLogin.username));
                    if (valid) {
                        this.loginNow('abcdef123455667dfdfgahoiajnasjbh')
                        
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                     if(this.formLogin.remember[0] == "记住密码"){
                        sessionStorage.setItem('username', JSON.stringify(this.formLogin.username));
                        sessionStorage.setItem('password', JSON.stringify(this.formLogin.password));
                    }else{
                        sessionStorage.removeItem('username');
                        sessionStorage.removeItem('password');
                    }
                })
            },
            formLoginReset(name){
                this.$refs[name].resetFields();
            },
            loginNow(params) {
                axios({
                url: 'api/token',
                method: 'post',
                data: {
                    key: 'abcdef123455667dfdfgahoiajnasjbh',
                    username: this.formLogin.username,
                    password: this.formLogin.password,
                },
                transformRequest: [function (data) {
                    let ret = ''
                    for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                    }
                    return ret
                }],
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
                }).then(res=>{
                    if(res.data.message == 'ok'){
                        this.$Message.success('登录成功!');
                        sessionStorage.setItem('token', res.data.data.token);
                        sessionStorage.setItem('userInfo', JSON.stringify({userName:this.formLogin.username,nickName:res.data.data.nickname}));
                        this.$router.push({ path: '/situation' });
                    } else {
                        this.$Message.error('登录失败,请检查用户名密码是否正确!');
                    }

                })
            }
            
        },
        mounted() {
            if(sessionStorage.getItem('username')){
                this.formLogin.username = JSON.parse(sessionStorage.getItem('username'));
            }
            if(sessionStorage.getItem('password')){
                this.formLogin.password = JSON.parse(sessionStorage.getItem('password'));
            }
        }
    }
</script>


