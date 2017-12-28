<style scoped>
	.divisionLine{
		height: 15px;
		background-color: #f5f7f9;
		width: auto;
	}
	.layout-content-filtrate{
		padding: 15px;
		margin-bottom: -20px;
    }
	.layout-content-situation{
		padding: 15px;
	}		

</style>
<template>
<div>
	<div class="layout-content-filtrate">
		<Form label-position="right" :label-width="100">
			<row>
				<Col span="7">
					<Form-item label="车牌号:">
						<Input v-model.trim="vpl_number"></Input>
					</Form-item>	
				</col>
				<Col span="7">	
					<Form-item>
						<Button type="primary" @click="query" style="width:120px;">查询</Button>
					</Form-item>
				</col>
			</row>	
		</Form>
	</div>
	<div class="divisionLine"></div>
	<div class="layout-content-situation">
		<Table border :columns="table.columns" :data="table.data" ref="table"></Table>	
	</div>
</div> 
</template>

<script>
import {mapState, mapActions, mapGetters} from 'vuex';
import {getCarUserList} from '../../../api/situation';
import DateFormat from '../../../commons/utils/formatDate.js';
export default {
    data () {
        return {
            vpl_number:'',
            table: {
                columns: [
                    {
                        title: 'UID',
                        key: 'uid'
                    },
                    {
                        title: '车牌号',
                        key: 'vpl_number'
                    },
                    {
                        title: '是否授权车',
                        key: 'is_auth'
                    },   
                    {
                        title: '手机号',
                        key: 'mobile'
                    }, 
                    // {
                    //     title: '注册地',
                    //     key: 'regArea'
                    // }, 
                    // {
                    //     title: '注册时间',
                    //     key: 'regTime'
                    // }, 
                    {
                        title: '是否APP用户',
                        key: 'is_app'
                    }, 	
                    {
                        title: '是否微信用户',
                        key: 'is_wechat'
                    }, 	
                    {
                        title: '车品牌',
                        key: 'brand'
                    }, 	
                    {
                        title: '最近停车时间',
                        width: '140',
                        key: 'last_time'
                    }, 		
                    {
                        title: '详情',
                        width: '90',
                        key: 'isAuthorize',
                            align: 'center',
                            render: (h, params) => {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: {
                                            width:'50px',
                                        },
                                        on: {
                                            click: () => {
                                                this.routerGo(params.row.vpl_number)
                                            }
                                        }
                                    }, '查询'),
                                ]);
                            }                        
                    }, 																																																                    
                ],
                data:[]                    
            },
        }
    },
	computed: {
        ...mapState({
            userCenter_list:'userCenter_list'
        }),	          
        parkList () {
		    return JSON.parse(sessionStorage.getItem('parkList')) || [];	
        },
        max_park_code () {
            if(this.carInfo.max_park_code.length==0){
                return ''
            }
            return this.transform(this.carInfo.max_park_code)
        }        
	},
    watch:{
        'userCenter_list':{
            handler:function(newVal,oldVal){
                this.handleTableData(newVal);
            },     
        },
    },    
	mounted () {
        if(this.userCenter_list.length==0){
            this.$store.dispatch('getCarUserList');
        }else{
            this.handleTableData(this.userCenter_list);
        }
	 },    	 	    
    methods: {
        handleTableData(res) {
            let tableShowData = Object.assign({}, res),rowData = [];
            for(let item in tableShowData) {
                let raw = {
                    uid:tableShowData[item].uid,
                    vpl_number:tableShowData[item].vpl_number,
                    is_auth:tableShowData[item].is_auth==1? '是':'否',
                    mobile:tableShowData[item].mobile,
                    is_app:tableShowData[item].is_app==1? '是':'否',
                    is_wechat:tableShowData[item].is_wechat==1? '是':'否',
                    last_time:this.transformDate(tableShowData[item].last_time),
                }
                rowData.push(raw);
            }
            this.table.data = rowData;
        }, 
        query () {
            if(this.vpl_number.length==0 || !this.isVehicleNumber(this.vpl_number)){
                this.$Message.warning('请输入正确的车牌号')
                return
            }  
            this.$router.push({ path: '/cardetail', query:{num: this.vpl_number}});
        },           
        routerGo(param) {
            this.$router.push({ path: '/cardetail', query:{num: param}});
        },
        //时间转换
        transformDate(date) {
            if(date==0){
                return ''
            }
            return DateFormat.format(new Date(date*1000), 'yyyy-MM-dd hh:mm')	
        }, 
        //验证车牌号是否合法
        isVehicleNumber(vehicleNumber) {
            let result = false;
            if (vehicleNumber.length == 7){
                let express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
                result = express.test(vehicleNumber);
            }
            return result;
        }                     	                      
    }
}    
</script>