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
        text-align: left;
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
    .planPop{
        max-width: 300px;
        white-space: normal;
        word-break: break-all;
        max-height: 250px;
        overflow-y: scroll;
    }
    .planPop::-webkit-scrollbar {
        display: none;
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
                        <Upload v-show="!upState.BtnDisabled" action="api/app/uploadfile" :format="appFormat" :headers="uploadHeaders"
                        name="upload" :on-format-error="appFormatError" :show-upload-list="uploadList" :before-upload="beforeUpload"
                         :on-success="UploadSuccess" :on-error="uploadError">
                            <Button type="primary" :loading="upState.Btnloading">{{upState.BtnText}}</Button>
                        </Upload>
                        <Button v-show="upState.BtnDisabled" type="primary" :loading="upState.Btnloading">{{upState.BtnText}}</Button>
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
                        <Input v-model="info.version_max" :number="isNumber" @on-change="numAbsolute('max')" :maxlength="(md5length-22)"></Input>
                    </Form-item>
                    <Form-item label="覆盖版本号下限:">
                        <Input v-model="info.version_min" :number="isNumber" @on-change="numAbsolute('min')" :maxlength="(md5length-22)"></Input>
                    </Form-item>
                </Col>
                <Col span="9" offset="1">
                    <Form-item label="MD5值:">
                        <Input v-model="info.md5" :maxlength="md5length" @on-change="lowerCase"></Input>
                    </Form-item> 
                    <Form-item label="产品线:">
                        <Input v-model="info.product_line" readonly></Input>
                    </Form-item>
                    <Form-item label="推荐策略:">
                        <Radio-group v-model="info.update_type" @on-change="selectUpType">
                            <Radio label="0">推荐更新</Radio>
                            <Radio label="1">强制更新</Radio>
                        </Radio-group>
                    </Form-item>
                    <Form-item label="弹窗策略:">
                        <Radio-group v-model="info.popup_type">
                            <Radio label="0">每次启动弹窗</Radio>
                            <Radio :disabled="update_type" label="1">每天弹窗一次</Radio>
                            <Radio :disabled="!update_type" label="2">不弹窗</Radio>
                        </Radio-group>
                    </Form-item>
                </Col>
            </Row>
            <Row>
                <Col span="20" offset="1">
                    <Form-item class="planForm" label="更新计划:">
                        <table class="planTable">
                            <tr v-for="(item, index) in updatePlanSort" :key="index">
                                <td class="time">{{item.time}}</td>
                                <td>
                                    <Tooltip placement="top">
                                        <p class="area">向{{item.areaStr}}</p>
                                        <div class="planPop" slot="content">
                                            <p>{{item.areaStr}}</p>
                                        </div>
                                    </Tooltip>
                                </td>
                                <td>的用户:</td>
                                <td>
                                    <Tooltip placement="top">
                                        <p class="area">{{item.user}}</p>
                                        <div class="planPop" slot="content">
                                            <p>{{item.user}}</p>
                                        </div>
                                    </Tooltip>
                                </td>
                                <td>推荐更新</td>
                                <td><span class="edit" @click="editPlan({idx:index,val:item,id:item.id})">修改</span></td>
                                <td><span class="delete" @click="deletePlan({idx:index,id:item.id})">删除</span></td>
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
                    <Form-item label="更新内容:" prop="update_content">
                    
                        <Input v-model.trim="info.update_content" @on-change="processtext" @keyup.enter.native="textKeyUp" type="textarea" :maxlength="contentlength" :rows="6" placeholder="45字以内"></Input>
                    </Form-item>     
                    <Form-item>
                        <Button type="primary" @click="submit">提交</Button>
                        <Button type="ghost" @click="preview" style="margin-left: 15px">预览</Button>
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
import DateFormat from '../../../../commons/utils/formatDate';
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
                update_type:'0',
                popup_type:'',
                update_content:'',
                filename: '',
                filesize:'',
                url:'',
            },
            textLength: 0,
            iTime: null,  
            textAreaState: false,
            appFormat: ['apk'],
            appMD5: '',
            contentlength: 47,
            md5length: 32,
            isNumber: true,
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
            showAddPlan: 'showAddPlan',
            updatePlan: 'updatePlan',
            planId: 'planId',
            editConfigData: 'editConfigData',
            confirmEdit: 'confirmEdit',
        }),
        uploadHeaders () {
            return {token:sessionStorage.getItem('token')};
        },
        updatePlanSort () {
            return this.updatePlan.sort((first,second)=>{
                return DateFormat.compareDate(DateFormat.formatToDate(first.time),DateFormat.formatToDate(second.time))
            })
        },
        update_type () {
            return Boolean(parseInt(this.info.update_type));
        }	        
    },  
    watch: {
        'editConfigData.val':{
            deep:true,
            handler:function(newVal,oldVal){
                if(this.editConfigData.state) {
                    this.SetEditConfig(newVal);
                    this.getUpdatePlan(newVal.id)
                }
                else {
                    this.reset();
                }
            },
        },
        'confirmEdit':{
            handler:function(newVal,oldVal) {
                if(newVal) {
                    this.submit();
                }
            } 
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
        UploadSuccess (res, file) {
            this.upState = {
                BtnText:'重新上传',
                Btnloading:false,   
                BtnDisabled:false            
            }            
            if(res.message!=='ok' && res.data.upload2CDN!=='ok'){
               this.$Message.warning(res.message); 
               return
            }
            this.info.versionname = res.data.versionname;
            this.appMD5 = res.data.md5;
            this.info.versioncode = res.data.versioncode;
            this.info.filename = res.data.filename;
            this.info.filesize = res.data.filesize;
            this.info.product_line = res.data.packagename;
            this.info.url = res.data.url;
        },
        //文件上传失败
        uploadError (error) {
            this.upState = {
                BtnText:'点击上传',
                Btnloading:false,   
                BtnDisabled:false            
            }               
            this.$Message.warning('上传失败，请重试！');
        },
        appFormatError (res,file) {
            this.$Message.warning('请上传apk文件！');
            this.upState = {
                BtnText:'点击上传',
                Btnloading:false,   
                BtnDisabled:false            
            }  
        },
        submit () {
            for(let item in this.info) {
                if(this.info[item].length == 0){
                    this.$Message.warning('请填写完整信息！');
                    return
                }
            }
            if(this.info.md5 !== this.appMD5){
                this.$Message.warning('填写MD5值与上传App的MD5值不一致！');
                return                
            }
            this.info.version_max = parseInt(this.info.version_max);
            this.info.version_min = parseInt(this.info.version_min);
            this.info.md5 = this.info.md5;
            this.info.update_type = parseInt(this.info.update_type);
            this.info.popup_type = parseInt(this.info.popup_type);
            this.info.filesize = parseInt(this.info.filesize);
            //判断提交状态为编辑或添加
            if(this.editConfigData.state){
                this.updateAppConfig({id:this.editConfigData.val.id,val:this.info});  
            }
            else {
                this.setAppConfig(this.info);  
            }
                    
        },
        SetEditConfig (value) {
            this.upState.BtnText = '重新上传';
            this.appMD5 = value.md5;
            this.info = {
                versionname: value.versionname,
                versioncode: value.versioncode,
                version_max: value.version_max,
                version_min: value.version_min,
                md5: value.md5,
                filesize: value.filesize,
                product_line: value.product_line,
                update_type: value.update_type,
                popup_type: value.popup_type,
                update_content: value.update_content,
                filename:  value.filename,
                url: value.url,
            } 
        },      
        //添加配置信息  
        setAppConfig (params) {
            let param = {info:JSON.stringify(this.info),plan_ids:this.planId.join(',')}
            return operationService.setAppConfig(param).then(res => {
                if(res.status ==200 && res.data.message=='ok'){
                    this.$Message.success('提交成功');
                    this.$store.commit('SET_CONFIG_CONFIG_TIME',new Date());
                    this.$store.commit('SET_ADDPLAN_ADD',[]);
                    this.$store.commit('SET_ADDPLAN_SHOW',false);
                    this.$store.commit('SET_CONFIRM_EDIT',false);
                    this.reset();
                } else{
                    this.$Message.error(res.data.message);
                }
            });
        }, 
        //更新配置信息
        updateAppConfig (params) {
            let param = {id:params.id,val:{info:JSON.stringify(this.info)}}
            return operationService.updateAppConfig(param).then(res => {
                if(res.status ==200 && res.data.message=='ok'){
                    this.$Message.success('提交成功');
                    this.editConfigData.state = false;
                    this.$store.commit('SET_ADDPLAN_ADD',[]);
                     this.$store.commit('SET_EDIT_CONFIG_DATA',this.editConfigData);
                    this.$store.commit('SET_CONFIG_CONFIG_TIME',new Date());
                    this.$store.commit('SET_ADDPLAN_SHOW',false);
                    this.$store.commit('SET_CONFIRM_EDIT',false);
                    this.reset();
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
                    this.showEditPlan(res.data.data)
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
                    this.$store.commit('SET_ADDPLAN_ADD',plan);
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
        sendDeletePlan (params) {
            return operationService.deletePlan(params).then(res => {
                if(res.status ==200 && res.data.message=='ok'){
                    return res;
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
        //预览
        preview () {
            this.$store.commit('SET_PREVIEW_STATE',{state:true,val:this.info});
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
            this.changePlan = {idx:value.idx,val:option,id:value.id};
            this.$store.commit('SET_ADDPLAN_SHOW',true);
        },
        // 删除计划
        deletePlan (value) {
            this.$Modal.confirm({
                title: '确认删除',
                content: '<p>确认要删除此条更新计划么?</p>',
                onOk: () => {
                    this.sendDeletePlan(value.id).then((res)=>{
                        if(res.status ==200 && res.data.message=='ok'){
                            this.updatePlan.splice(value.idx, 1);
                            for(let i in this.planId){
                                if(value.id == this.planId[i]){
                                    this.planId.splice(i, 1);
                                }
                            }
                            this.$store.commit('SET_PLAN_ID',this.planId);
                            this.$store.commit('SET_ADDPLAN_ADD',this.updatePlan);
                        } else{
                            this.$Message.error(res.data.message);
                        }
                    })                    
                },
                onCancel: () => {
                    return
                }
            }); 
        },
        //选择推荐策略
        selectUpType () {
            this.info.popup_type = '';
        },
        processtext () {
        
                let text = this.info.update_content.replace(/(\r\n|\n|\r)/gm,'').trim(); 
            
                if((text.length%15)==0&&text.length>0&&text.length<45) {
                    this.info.update_content = this.info.update_content+'\r\n';
                    
                } 
 

            
        },
        textKeyUp () {
            this.textLength = 0;
            // clearTimeout(this.iTime)
            // this.iTime = setTimeout(()=> {
            //     console.warn('keyup')
            //     this.textAreaState = true;
            //     this.processtext()
            // }, 800);   
        },
        //转为小写
        lowerCase () {
            this.info.md5 = this.info.md5.toLowerCase();
        },
        //转为绝对值
        numAbsolute (type) {
            if (type=='max' && this.info.version_max<0) {
                this.info.version_max = Math.abs(this.info.version_max);
            }
            if (type=='min'&& this.info.version_min<0) {
                this.info.version_min = Math.abs(this.info.version_min);
            }            
        }
    },
    directives: {
        compositionend: {
            params: ['textAreaState'],
            inserted: function (el) {
                let text='',state=false,str='';
                el.addEventListener('input',(e)=>{
                    text = e.target.value  
                    if(state){
                        text = text + str
                        console.log(text)
                    }     
                    else{
                        console.log(text)
                    }            
                    //console.log(text)
                    //this.params.textAreaState = true;
                });                
                el.addEventListener('compositionstart',(e)=>{
                    console.log(e)
                    state = true
                    //this.params.textAreaState = true;
                });
                el.addEventListener('compositionend',(e)=>{
                    str = e.data
                    state = false
                    //this.params.textAreaState = true;
                })                
            }
        }
    },
    components: {
        'update-plan': updatePlan,
    }                
}
</script>