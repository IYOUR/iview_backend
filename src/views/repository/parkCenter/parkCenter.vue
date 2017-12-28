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
					<Form-item label="车场名称:">
                        <Select v-model="parkCode" filterable clearable placeholder="输入车场名称">
                            <Option v-for="item in parkList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>                        
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
import {getParkCenterList} from '../../../api/situation';
import DateFormat from '../../../commons/utils/formatDate.js';
export default {
    data () {
        return {
            parkCode:'',
            table: {
                columns: [
                    {
                        title: '车场名称',
                        key: 'parkNmae'
                    },
                    {
                        title: '所属集团',
                        key: 'group'
                    },
                    {
                        title: '业态',
                        key: 'park_type'
                    },   
                    {
                        title: '是否支持在线支付',
                        key: 'support_online'
                    }, 
                    {
                        title: '车位数',
                        key: 'space'
                    }, 	
                    {
                        title: '在停车数量',
                        key: 'in_park'
                    }, 	
                    {
                        title: '实力指数',
                        key: 'park_exp'
                    }, 	
                    {
                        title: '地址',
                        //width: '140',
                        key: 'park_address'
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
                                                this.routerGo(params.row.park_code)
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
            parkCenter_list:'parkCenter_list'
        }),	         
        parkList () {
		    return JSON.parse(sessionStorage.getItem('parkList')) || [];	
        },
        companyList () {
		    return JSON.parse(sessionStorage.getItem('companyList')) || [];	
        },        
        max_park_code () {
            if(this.carInfo.max_park_code.length==0){
                return ''
            }
            return this.transform(this.carInfo.max_park_code)
        }        
	},
    watch:{
        'parkCenter_list':{
            handler:function(newVal,oldVal){
                this.handleTableData(newVal);
            },     
        },
    },
	mounted () {
        if(this.parkCenter_list.length==0){
            this.$store.dispatch('getParkCenterList');
        }else{
            this.handleTableData(this.parkCenter_list);
        }
	 },    	 	    
    methods: {
        handleTableData(res) {
            let tableShowData = Object.assign({}, res),rowData = [];
            for(let item in tableShowData) {
                let raw = {
                    parkNmae:this.transformPark(tableShowData[item].park_code),
                    park_code:tableShowData[item].park_code,
                    group:this.transformGroup(tableShowData[item].cid),
                    park_type:this.transformType(tableShowData[item].park_type),
                    mobile:tableShowData[item].mobile,
                    support_online:tableShowData[item].support_online==1? '是':'否',
                    space:tableShowData[item].space,
                    in_park:tableShowData[item].in_park,
                    park_exp:tableShowData[item].park_exp,
                    park_address:tableShowData[item].park_address,
                }
                rowData.push(raw);
            }
            this.table.data = rowData;
        }, 
        query () {
            if(this.parkCode.length==0){
                this.$Message.warning('请输入车场名称')
                return
            }  
            this.$router.push({ path: '/parkdetail', query:{num: this.parkCode}});
        },           
        routerGo(param) {
            this.$router.push({ path: '/parkdetail', query:{num: param}});
        },
        //将车场对应的code转换为名称
        transformPark(code) {
            if(code.length==0){
                return ''
            }
            for(let j=0;j<this.parkList.length;j++) {
                if(this.parkList[j].value == code){
                    return this.parkList[j].label
                }
            }	
            return ''	
        },    
        //将车场集团对应的code转换为名称
        transformGroup(code) {
            if(code.length==0){
                return ''
            }
            for(let j=0;j<this.companyList.length;j++) {
                if(this.companyList[j].value == code){
                    return this.companyList[j].label
                }
            }	
            return ''	
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
        },
        transformType (code) {
            let dictionary = ['经营性','非经营性','道边车场','商场','住宅','写字楼','酒店','景点','商业综合体','办公园区','物流园','医院','车站','政府机关','剧院','学校','机场'];
            if(code==100){
                return '第三方对接车场'
            } 
            return dictionary[code]           
        }                     	                      
    }
}    
</script>
