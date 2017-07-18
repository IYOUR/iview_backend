<style scoped>
    .planTable{
        border: 1px solid #dddee1;
        border-collapse: separate;   
        border-radius: 4px; 
        padding: 5px;
        width: 100%; 
        min-height:32px;
        margin-bottom: 15px;  
        white-space: nowrap;   
    }
    .planTable tr{  
        border: 1px solid #dddee1;  
    }
    .planTable .area{  
        max-width: 200px;  
        overflow: hidden;
        text-overflow:ellipsis;
    }
    .planTable .user{  
        max-width: 200px;  
        overflow: hidden;
        text-overflow:ellipsis;
    }
    .planTable .edit{  
        color: #2b85e4;
        cursor: pointer;
    }
    .planTable .delete{  
        color: #ed3f14;
        cursor: pointer;
    }
    .layoutBetween {
        padding-top: 20px;
    } 
    .filename{
        line-height: 32px;
    }     
</style>
<template>
    <div>
        <Form label-position="right" :label-width="100">
            <Row>
                <Col span="5" offset="1">
                    <Form-item label="更新包路径:">
                        <Upload action="api/app/uploadfile" accept=".apk" :headers="uploadHeaders" name="upload" :show-upload-list="uploadList" :before-upload="beforeUpload" :on-success="UploadSuccess">
                            <Button type="primary":loading="upState.Btnloading">{{upState.BtnText}}</Button>
                        </Upload>
                    </Form-item>
                </Col>
                <Col span="2">
                    <span class="filename">{{info.filename}}</span>
                </Col>
            </Row>
            <Row>
                <Col span="9" offset="1">
                    <Form-item label="版本名称:">
                        <Input v-model="info.versionname" readonly></Input>
                    </Form-item>
                    <Form-item label="版本号:">
                        <Input v-model="info.versioncode" readonly></Input>
                    </Form-item>
                    <Form-item label="覆盖版本号上限:">
                        <Input v-model="info.version_max"></Input>
                    </Form-item>
                    <Form-item label="覆盖版本号下限:">
                        <Input v-model="info.version_min"></Input>
                    </Form-item>
                </Col>
                <Col span="9" offset="1">
                    <Form-item label="MD5值:">
                        <Input v-model="info.md5" readonly></Input>
                    </Form-item> 
                    <Form-item label="产品线:">
                        <Radio-group v-model="info.product_line">
                            <Radio label="0">KOP</Radio>
                            <Radio label="1">ECP</Radio>
                            <Radio label="2">IOP</Radio>
                        </Radio-group>
                    </Form-item>
                    <Form-item label="推荐策略:">
                        <Radio-group v-model="info.update_type">
                            <Radio label="0">推荐更新</Radio>
                            <Radio label="1">强制更新</Radio>
                        </Radio-group>
                    </Form-item>
                    <Form-item label="弹窗策略:">
                        <Radio-group v-model="info.popup_type">
                            <Radio label="0">每次启动弹窗</Radio>
                            <Radio label="1">每天弹窗一次</Radio>
                            <Radio label="2">不弹窗</Radio>
                        </Radio-group>
                    </Form-item>
                </Col>
            </Row>
            <Row>
                <Col span="20" offset="1">
                    <Form-item label="更新计划:">
                        <table class="planTable">
                            <tr v-for="(item, index) in updatePlan" track-by="item" key="index">
                                <td class="time">{{item.time}}</td>
                                <td class="area">向{{item.areaStr}}</td>
                                <td>的用户</td>
                                <td class="user">{{item.user}}</td>
                                <td>推荐更新</td>
                                <td><span class="edit" @click="editPlan({idx:index,val:item})">修改</span></td>
                                <td><span class="delete" @click="deletePlan(index)">删除</span></td>
                            </tr>															
                        </table>		
                        <Button @click="addPlan" type="primary" icon="plus-round">添加更新计划</Button>
                    </Form-item>
                </Col>
            </Row>
            <transition name="fade">
                <update-plan v-show="showAddPlan" :change-plan="changePlan"></update-plan>
            </transition>
            <Row class="layoutBetween"> 
                <Col span="9" offset="1">            
                    <Form-item label="更新内容:">
                            <Input v-model="info.update_content" type="textarea" :rows="6" placeholder="45字以内"></Input>
                    </Form-item>     
                    <Form-item>
                        <Button type="primary" @click="submit">提交</Button>
                        <Button type="ghost" style="margin-left: 15px">预览</Button>
                    </Form-item>    
                </Col>
            </Row>                     
        </Form>
    </div>
</template>
<script>
import {mapState, mapActions, mapGetters} from 'vuex';
import * as operationService from '../../../../api/operation';
import CONSTANT from '../../../../commons/utils/code';
import updatePlan from './updatePlan.vue'

export default {
    data () {
        return {
            info:{
                versionname:'',
                versioncode:'',
                version_max:'',
                version_min:'',
                md5:'',
                product_line:'',
                update_type:'',
                popup_type:'',
                update_content:'',
                filename: ''
            },   
            changePlan: {},
            uploadList: false,
            upState:{
                BtnText:'点击上传',
                Btnloading:false, 
                BtnDisabled:false
            },
            showUpdatePlan: [],   
        }
    },
    computed: {	
        ...mapState({
            showAddPlan: 'showAddPlan',
            updatePlan: 'updatePlan'
        }),
        uploadHeaders () {
            return {token:sessionStorage.getItem('token')};
        }	        
    },
    watch: {
        'updatePlan': {
            deep: true,
            handler:function(newVal,oldVal){
                console.log("sdf")
                this.showUpdatePlan = newVal
            }
        }
    },    
    created () {

    },         
    methods:{   
        beforeUpload () {
            this.upState = {
                BtnText:'上传中',
                Btnloading:true,
                BtnDisabled:true                
            }            
        },       
        UploadSuccess (res, file) {
            this.info.versionname = res.data.VersionName;
            this.info.md5 = res.data.MD5;
            this.info.versioncode = res.data.VersionCode;
            this.info.filename = res.data.Filename;
            this.upState = {
                BtnText:'重新上传',
                Btnloading:false,   
                BtnDisabled:false            
            }
        },
        submit () {
            this.info.version_max = parseInt(this.info.version_max);
            this.info.version_min = parseInt(this.info.version_min);
            this.info.md5 = parseInt(this.info.md5);
            this.info.product_line = parseInt(this.info.product_line);
            this.info.update_type = parseInt(this.info.update_type);
            this.info.popup_type = parseInt(this.info.popup_type);
            this.setAppConfig(this.info)
        },
        setAppConfig (params) {
            let param = {info:JSON.stringify(this.info)}
            return operationService.setAppConfig(param).then(res => {
                if(res.status ==200 && res.data.message=='ok'){
                    this.$Message.success('提交成功');
                    this.reset();
                } else{
                    this.$Message.error(res.data.message);
                }
            });
        }, 
        //重置
        reset () {
            this.upState.BtnText = '点击上传';
            this.info = {
                versionname:'',
                versioncode:'',
                version_max:'',
                version_min:'',
                md5:'',
                product_line:'',
                update_type:'',
                popup_type:'',
                update_content:'',
                filename: ''
            } 
        },
        addPlan () {
            this.$store.commit('SET_ADDPLAN_SHOW',true);
        },
        // 修改计划
        editPlan (value) {
            let option = Object.assign({}, value.val),arr=[];
            for(let idx in option.area){
                arr.push(JSON.stringify(option.area[idx]))
            }
            option.area = arr;
            this.changePlan = {idx:value.idx,val:option};
        },
        // 删除计划
        deletePlan (value) {
            this.updatePlan.splice(value, 1);
            this.$store.commit('SET_ADDPLAN_ADD',this.updatePlan);
        }                          
    },
    components: {
        'update-plan': updatePlan,
    }                
}
</script>