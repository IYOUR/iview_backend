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
</style>

<template>
    <Row class="addcontainer">
        <Col span="20" offset="1">
            <Form label-position="right" :label-width="100">
                <Row>
                    <Col span="11">
                        <Form-item label="白名单:">
                            <Input v-model="userList"></Input>
                        </Form-item>
                        <Form-item label="推送地域:">
                            <Select v-model="ProvinceCode" @on-change="selectProvince" filterable>
                                <Option v-for="item in provinceItme" :value="item.value" :key="item">{{ item.label }}</Option>
                            </Select>
                            <Card class="areaList" :padding="cardPadding" dis-hover>
                                <Checkbox-group v-model="areaArr">
                                    <Checkbox v-for="item in cityItem" :label="JSON.stringify(item)" :key="item">{{ item.label }}</Checkbox>
                                </Checkbox-group>
                            </Card>
                        </Form-item>             
                        <Form-item label="已选择地区:">            
                            <Card class="areaContent" :padding="cardPadding" dis-hover>
                                <Tag v-for="(item,index) in selectedArea" key="item" @on-close="cancelSelect(index)" closable>{{item.label}}</Tag>
                            </Card>            
                        </Form-item>   
                        <Form-item label="执行时间:">
                            <Date-picker v-model="planTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期和时间" placement="top-start" style="width: 100%"></Date-picker>
                        </Form-item>   
                        <Form-item>
                            <Button type="primary" @click="save">保存</Button>
                            <Button type="ghost" @click="reset" style="margin-left: 15px">重置</Button>
                        </Form-item> 
                    </Col>
                    <Col span="8" offset="1">
                        <Button type="primary">点击上传</Button>
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
            cardPadding: 0,
            ProvinceCode: 'all',
            provinceItme: [],
            cityItem: [],
            areaArr: [],
            userList: '',
            planTime: '',
            isEeditState: false,
            planIdArr: [],
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
            }
        }
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
            if(this.userList == '' || this.planTime == '' || this.areaArr == []){
                this.$Message.warning('请填写完整更新计划信息');
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
                user: this.userList,
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
                    this.updatePlan.push({
                        id: res.data.data,
                        user: this.userList,
                        area: this.selectedArea,
                        areaStr: area.str,
                        time: DateFormat.format(this.planTime, 'yyyy-MM-dd hh:mm:ss'),                       
                    });
                    this.planIdArr.push(res.data.data);
                    this.$store.commit('SET_PLAN_ID',this.planIdArr);
                    this.$store.commit('SET_ADDPLAN_ADD',this.updatePlan);
                    this.reset();
                });
            }
        },
        // 重置
        reset () {
            this.userList = '',
            this.planTime = '',
            this.areaArr = [];
            this.isEditState = false;        
        },            
        loadAreaInfo() {
            this.getProvinceList().then((res)=>{
                let data = Object.assign([], res.data.data);
                this.cityItem = Object.assign([], data);
                data.unshift({label:'全国',value:'all'});
                this.provinceItme = data;
            });
        },
        // 取消已选择的地区 
        cancelSelect (value) {
            this.areaArr.splice(value, 1);
        },
        closeAdd () {
            this.$store.commit('SET_ADDPLAN_SHOW',false);
        },          
        selectProvince(value) {
            if(value !=='all'){
                this.getCityList({levelType:'2',parent:value});
            } else {
                this.cityItem = this.provinceList;
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
        },
        sendAddPlan (params) {
            let param = {info:JSON.stringify(params)}
            return operationService.addUpdatePlan(param).then(res => {
                if (res.status != CONSTANT.HTTP_STATUS.SUCCESS.CODE) {
                    this.$Message.error(res.message || CONSTANT.HTTP_STATUS.SERVER_ERROR.MSG);
                    return;
                }; 
                return res
            });    
        },
        sendUpdatePlan (params) {
            let param = {
                    id: params.id,
                    val:{info:JSON.stringify(params.val)}
            };
            return operationService.updatePlan(param).then(res => {
                if (res.status != CONSTANT.HTTP_STATUS.SUCCESS.CODE) {
                    this.$Message.error(res.message || CONSTANT.HTTP_STATUS.SERVER_ERROR.MSG);
                    return;
                }; 
            });    
        }        
    }
}
</script>

