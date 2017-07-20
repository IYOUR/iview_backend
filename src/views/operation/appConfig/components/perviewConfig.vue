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
        <Form label-position="right" :label-width="120">
            <Row>
                <Col span="5" offset="1">
                    <Form-item label="更新包路径:">
                        <span>{{info.filename}}</span>
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
                            <tr v-for="(item, index) in updatePlan" track-by="$index" :key="index">
                                <td class="time">{{item.time}}</td>
                                <td class="area">向{{item.areaStr}}</td>
                                <td>的用户</td>
                                <td class="user">{{item.user}}</td>
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
                        <Button type="primary" @click="close">确定</Button>
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
        }),
        InfoData () {

        },
        uploadHeaders () {
            return {token:sessionStorage.getItem('token')};
        }	        
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
                product_line: this.transitionList('productLine',newVal.val.product_line),
                update_type: this.transitionList('recomPolicy',newVal.val.update_type),
                popup_type: this.transitionList('popup',newVal.val.popup_type),
                update_content: newVal.val.update_content,
                filename:  newVal.val.filename
            } 
            },
        }
    },          
    methods:{   
        beforeUpload () {
            this.upState = {
                BtnText:'上传中',
                Btnloading:true,
                BtnDisabled:true                
            }            
        }, 
        close () {
            this.previewInfo.state = false;
            this.$store.commit('SET_PREVIEW_STATE',this.previewInfo);
        },
        submit () {
            for(let item in this.info) {
                if(this.info[item].length == 0){
                    this.$Message.warning('请填写完整信息！');
                    return
                }
            }
            this.info.version_max = parseInt(this.info.version_max);
            this.info.version_min = parseInt(this.info.version_min);
            this.info.md5 = this.info.md5;
            this.info.product_line = parseInt(this.info.product_line);
            this.info.update_type = parseInt(this.info.update_type);
            this.info.popup_type = parseInt(this.info.popup_type);
            if(this.isEditState){
                this.updateAppConfig({id:this.editConfigData.id,val:this.info});  
            }
            else {
                this.setAppConfig(this.info);  
            }
                    
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
        //添加配置信息  
        setAppConfig (params) {
            let param = {info:JSON.stringify(this.info),plan_ids:this.planId.join(',')}
            return operationService.setAppConfig(param).then(res => {
                if(res.status ==200 && res.data.message=='ok'){
                    this.$Message.success('提交成功');
                    this.reset();
                } else{
                    this.$Message.error(res.data.message);
                }
            });
        },             
        sendDeletePlan (params) {
            return operationService.deletePlan(params).then(res => {
                if(res.status ==200 && res.data.message=='ok'){
                    return res;
                } else{
                    this.$Message.error(res.data.message);
                }
            });
        },                    
    },           
}
</script>