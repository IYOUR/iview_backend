<style scoped>
    .addcontainer{
        padding-top: 20px;
        background-color: #f5f7f9;
    }
    .areaList{
        margin-top: 15px;
        max-height: 150px;
        overflow-y: scroll;
    } 
    .areaList label{
        padding-left: 15px;
        margin-right: 0px;
        display:block;
    }
    .areaList label:hover{
        background: #f3f3f3;
    }    
    .areaContent{
        min-height: 35px;
        margin-top: 0px;        
    }
    .areaContent .ivu-tag{
        margin-left: 5px;
        margin-right: 5px;
    }
    .planTable{
        border: 1px solid #dddee1;
        border-collapse: separate;   
        border-radius: 4px; 
        padding: 5px;
        width: 100%; 
        margin-bottom: 15px;   
    }
    .planTable tr{  
        border: 1px solid #dddee1;        
    }  
    .closeIcon{
        cursor: pointer;
    }    
    .csvhint{
        cursor: pointer;
        margin-left: 20px;
        color: #495060;
    }
    .csvFormat{
        text-align: center;
        border: 1px solid #dddee1;
        border-collapse: collapse;   
    }
    .csvFormat tr{  
        border: 1px solid #dddee1;        
    }  
    .csvFormat td {
        min-width: 50px;
        border-width: 1px;
        border-style: solid;
        border-color: #dddee1;
        background-color: #ffffff;
    }        
</style>

<template>
    <Row class="addcontainer">
        <Col span="20" offset="1">
            <Form label-position="right" :label-width="120">
                <Row>
                    <Col span="11">
                        <Form-item label="白名单:">
                            <Input v-model.trim="userList" placeholder="不填写默认为全部"></Input>
                        </Form-item>
                        <Form-item label="推送地域:">
                            <Select v-model="ProvinceCode" @on-change="selectProvince" :disabled="slectDisabled" filterable>
                                <Option v-for="item in provinceItme" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <Card class="areaList" :padding="cardPadding" dis-hover>
                                <Checkbox-group v-model="areaArr" @on-change="checkArea">
                                    <Checkbox v-for="item in cityItem" :label="JSON.stringify(item)" :key="item.value">{{ item.label }}</Checkbox>
                                </Checkbox-group>
                            </Card>
                        </Form-item>             
                        <Form-item label="已选择地区:">            
                            <Card class="areaContent" :padding="cardPadding" dis-hover>
                                <Tag v-for="(item,index) in selectedArea" key="item" @on-close="cancelSelect(index)" closable>{{item.label}}</Tag>
                            </Card>            
                        </Form-item>   
                        <Form-item label="执行时间:">
                            <Date-picker v-model="planTime" type="datetime" :editable="dateEditable" format="yyyy-MM-dd HH:mm:ss" :options="disableDate" placeholder="选择日期和时间" placement="top-start" style="width: 100%"></Date-picker>
                        </Form-item>   
                        <Form-item>
                            <Button type="primary" @click="save">保存</Button>
                            <Button type="ghost" @click="reset" style="margin-left: 15px">重置</Button>
                        </Form-item> 
                    </Col>
                    <Col span="8" offset="1">
                        <label>
                            <p class="ivu-btn ivu-btn-primary">导入CSV</p>
                            <input type="file" ref="inputFile" value="" style="display:none" @change="importCsv">
                        </label>
                        <span class="csvhint">
                            <Poptip trigger="hover" placement="top">
                                <p><Icon type="ios-help-outline"></Icon>&nbsp格式</p> 
                                <div slot="title"><i>导入CSV格式如下！</i></div>
                                <div class="api" slot="content">
                                    <table class="csvFormat">
                                        <tbody>
                                            <tr v-for="n in 7">
                                                <td>012345</td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>更多...</td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </Poptip> 
                        </span>
                    </Col>
                </Row>
            </Form>
        </Col>
        <Col span="1" offset="1">
            <Icon @click.native="closeAdd" class="closeIcon" type="close-round"></Icon>
        </Col>
         
    </Row>

</template>

<script>
import {mapState, mapActions, mapGetters} from 'vuex';
import {getCityList} from '../../../../api/situation';
import CONSTANT from '../../../../commons/utils/code';
import DateFormat from '../../../../commons/utils/formatDate';
import * as operationService from '../../../../api/operation';

export default { 
    props:{
        changePlan: {
            type:Object,
            required:true
        }
    },
    data () {	
        return {
            disableDate: {
                disabledDate (date) {
                    return date && date.valueOf() < Date.now()-86400000;
                }					
            },
            labelValue: true, 
            slectDisabled: false,
            dateEditable: false,          
            cardPadding: 0,
            ProvinceCode: '100000',
            provinceItme: [],
            cityItem: [],
            areaArr: [],
            userList: '',
            planTime: '',
            isEeditState: false,
        }
    },
    computed: {
        ...mapState({
            provinceList: 'provinceList',
            showAddPlan: 'showAddPlan',
            updatePlan: 'updatePlan',
            planId: 'planId',
            editConfigData: 'editConfigData',
        }),	
        selectedArea () {
            return this.areaArr.map((item)=>{
                return JSON.parse(item);
            });
        }
    },
    watch: {
        'changePlan': {
            handler:function(newVal,oldVal){
                this.userList = newVal.val.user;
                this.planTime = DateFormat.formatToDate(newVal.val.time);
                this.areaArr = newVal.val.area;
                this.isEditState = true;
                if(newVal.val.areaStr == '全国'){
                    this.checkArea (['{"label":"全国","value":100000}']);            
                }else{
                    this.checkArea ([]);
                }
            }
        },

    },
    created () {
        this.loadAreaInfo();
    },     
    methods: {
        ...mapActions({
            getProvinceList: 'getProvinceList'
        }),
        // 保存
        save () {
            if(this.planTime == '' || this.areaArr.length==0){
                this.$Message.warning('请填写完整更新计划信息！');
                return
            }
            if(DateFormat.compareDate(this.planTime,new Date())<1){
                this.$Message.warning('执行时间不得小于当前时间！');
                return                
            }
            let area = {}, arrStr = [],arrVal = [];
            for(let item in this.selectedArea){
                arrStr.push(this.selectedArea[item].label);
                arrVal.push(this.selectedArea[item].value);
            }
            area.str = arrStr.join(',');
            area.val = arrVal.join(',');
            let plan = {
                user: (this.userList=='')?'全部':this.userList,
                area: this.selectedArea,
                areaStr: area.str,
                time: DateFormat.format(this.planTime, 'yyyy-MM-dd hh:mm:ss'),
            };
            let param = {
                app_info_id: (this.editConfigData.state)? this.editConfigData.val.id:0,    
                white_list: this.userList,
                region: area.val,
                time: DateFormat.format(this.planTime, 'yyyy-MM-dd hh:mm:ss'),
            }            
            // 判断是否为修改状态
            if(this.isEditState) {
                this.sendUpdatePlan({id:this.changePlan.id,val:param}).then((res)=>{
                    plan.id = this.changePlan.id;
                    this.updatePlan.splice(this.changePlan.idx, 1, plan)
                    this.$store.commit('SET_ADDPLAN_ADD',this.updatePlan);
                    this.reset();   
                    this.isEditState = false;     
                });   
            }
            else{
                this.sendAddPlan(param).then((res)=>{
                    plan.id = res.data.data;
                    this.updatePlan.push(plan);
                    this.planId.push(res.data.data);
                    this.$store.commit('SET_PLAN_ID',this.planId);
                    this.$store.commit('SET_ADDPLAN_ADD',this.updatePlan);
                    this.reset();
                });
            }
        },
        // 重置
        reset () {
            this.cancelSelect('0');
            this.userList = '',
            this.planTime = '',
            this.areaArr = [];
            this.isEditState = false;
            this.$refs.inputFile.value = '';   
            this.ProvinceCode = '100000';
        }, 
        //加载地区信息           
        loadAreaInfo() {
            this.getProvinceList().then((res)=>{
                let data = Object.assign([], res.data.data);
                data.unshift({label:'全国',value:'100000'});
                this.cityItem = Object.assign([], data)
                this.provinceItme = data;
            });
        },
        //导入csv文件并解析
        importCsv (e) {
            let file = e.target.files[0] || undefined;
            if (!file || file.name.slice(file.name.lastIndexOf('.'))!=='.csv') {
                this.$Message.warning('请导入CSV文件!');
                return
            }
            this.userList = '';
            let reader = new FileReader();  
            reader.readAsText(file);
            reader.onload = (e)=> {
                this.userList = e.target.result.replace(/(\r\n)+/g,',').replace(/,$/m,'');
            };
            reader.onerror = (e)=> {
                this.$Message.warning('读取文件失败!');
            };
        },
        //勾选地区
        checkArea (val) {
            let data =(val.length>0)?JSON.parse(val[(val.length-1)]):[];
            if(data.value && data.value=='100000'){
                this.cityItem = [{label:'全国',value:'100000'}];
                this.areaArr = [JSON.stringify({label:'全国',value:'100000'})];
                this.slectDisabled = true;
            }
            if(val.length==0){
                this.ProvinceCode = '100000';
                this.slectDisabled = false;
                this.cityItem = Object.assign([], this.provinceItme)               
            }
        },
        // 取消已选择的地区 
        cancelSelect (value) {
            if(this.areaArr.length>0){
                let data = JSON.parse(this.areaArr[value]);
                this.areaArr.splice(value, 1);
                if(data.value == '100000'){
                    this.slectDisabled = false;
                    this.cityItem = Object.assign([], this.provinceItme)
                }                
            }
        },
        closeAdd () {
            this.reset ();
            this.$store.commit('SET_ADDPLAN_SHOW',false);
        },          
        selectProvince(value) {
            if(value =='100000'){
                this.cityItem = this.provinceItme;
            } else {
                this.getCityList({levelType:'2',parent:value});
            }
        },	
        //获取城市列表	
        getCityList (params) {
            return getCityList(params).then(res => {
                if (res.status != CONSTANT.HTTP_STATUS.SUCCESS.CODE) {
                    this.$Message.error(res.message || CONSTANT.HTTP_STATUS.SERVER_ERROR.MSG);
                    return;
                }; 
                this.cityItem = res.data.data;
            });                         
        },// 发送添加计划请求
        sendAddPlan (params) {
            let param = {info:JSON.stringify(params)}
            return operationService.addUpdatePlan(param).then(res => {
                if (res.status ==200 && res.data.message=='ok') {
                    return res;
                } else{
                    this.$Message.error(res.data.message);
                }
            });    
        },
        sendUpdatePlan (params) {
            let param = {
                    id: params.id,
                    val:{info:JSON.stringify(params.val)}
            };
            return operationService.updatePlan(param).then(res => {
                if(res.status ==200 && res.data.message=='ok'){
                    return res
                } else{
                    this.$Message.error(res.data.message);
                }
            });    
        },     
    }
}
</script>

