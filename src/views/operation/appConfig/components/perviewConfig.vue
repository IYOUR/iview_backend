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
    .planTable td{  
        line-height: normal;  
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
        white-space: nowrap;
    }   
    .planStr{
        max-width: 300px;
        white-space: normal;
    }
    .ivu-form-item-content{
        line-height: inherit;
    }    
</style>
<template>
    <div>
        <Form label-position="right" :label-width="120">
            <Row>
                <Col span="5" offset="1">
                    <Form-item label="更新包:">
                        <span class="filename">{{info.filename}}</span>
                    </Form-item>
                </Col>
            </Row>
            <Row>
                <Col span="9" offset="1">
                    <Form-item label="版本名称:">
                        <span>{{info.versionname}}</span>
                    </Form-item>
                    <Form-item label="版本号:">
                        <span>{{info.versioncode}}</span>
                    </Form-item>
                    <Form-item label="覆盖版本号上限:">
                        <span>{{info.version_max}}</span>
                    </Form-item>
                    <Form-item label="覆盖版本号下限:">
                        <span>{{info.version_min}}</span>
                    </Form-item>
                </Col>
                <Col span="9" offset="1">
                    <Form-item label="MD5值:">
                        <span>{{info.md5}}</span>
                    </Form-item> 
                    <Form-item label="产品线:">
                        <span>{{info.product_line}}</span>
                    </Form-item>
                    <Form-item label="推荐策略:">
                        <span>{{info.update_type}}</span>
                    </Form-item>
                    <Form-item label="弹窗策略:">
                        <span>{{info.popup_type}}</span>
                    </Form-item>
                </Col>
            </Row>
            <Row>
                <Col span="20" offset="1">
                    <Form-item label="更新计划:">
                        <table class="planTable">
                            <tr v-for="(item, index) in updatePlan" :key="index">
                                <td class="time">{{item.time}}</td>
                                <td>
                                    <Tooltip placement="top">
                                        <p class="area">向{{item.areaStr}}</p>
                                        <div class="planStr" slot="content">
                                            <p>{{item.areaStr}}</p>
                                        </div>
                                    </Tooltip>
                                </td>
                                <td>的用户:</td>
                                <td>
                                    <Tooltip placement="top">
                                        <p class="user">{{item.user}}</p>
                                        <div class="planStr" slot="content">
                                            <p>{{item.user}}</p>
                                        </div>
                                    </Tooltip>
                                </td>
                                <td>推荐更新</td>
                            </tr>															
                        </table>	
                    </Form-item>
                </Col>
            </Row>
            <Row class="layoutBetween"> 
                <Col span="9" offset="1">            
                    <Form-item label="更新内容:" prop="update_content">
                        <span>{{info.update_content}}</span>
                    </Form-item>     
                    <Form-item>
                        <Button type="primary" @click="submit">确定</Button>
                        <Button type="ghost" @click="cancel" style="margin-left: 15px">返回编辑</Button>
                    </Form-item>    
                </Col>
            </Row>                     
        </Form>
    </div>
</template>
<script>
import {mapState, mapActions, mapGetters} from 'vuex';

export default {
    data () {
        return {
            info: {
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
            isEditState: false,  
            changePlan: {},
            uploadList: false,
            upState:{
                BtnText:'点击上传',
                Btnloading:false, 
                BtnDisabled:false
            }, 
        }
    },
    computed: {	
        ...mapState({
            updatePlan: 'updatePlan',
            previewInfo: 'previewInfo',
            editConfigData: 'editConfigData'
        }),        
    },  
    watch: {
        'previewInfo':{
            deep:true,
            handler:function(newVal,oldVal){
            this.info = {
                versionname: newVal.val.versionname,
                versioncode: newVal.val.versioncode,
                version_max: newVal.val.version_max,
                version_min: newVal.val.version_min,
                md5: newVal.val.md5,
                product_line: newVal.val.product_line,
                update_type: this.transitionList('recomPolicy',newVal.val.update_type),
                popup_type: this.transitionList('popup',newVal.val.popup_type),
                update_content: newVal.val.update_content,
                filename:  newVal.val.filename
            } 
            },
        }
    },          
    methods:{   
        transitionList (type,val) {
            switch (type) {
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
        submit () {
            this.$store.commit('SET_CONFIRM_EDIT',true);
            this.cancel();
        },
        cancel () {
            this.previewInfo.state = false;
            this.$store.commit('SET_PREVIEW_STATE',this.previewInfo);
        },                           
    },           
}
</script>