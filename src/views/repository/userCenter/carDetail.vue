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
		padding: 15px 60px;
	}	
    .carInfo p{
        line-height: 30px;
        font-size: 12px;
        color: #495060;
    }
    .carInfo p span{
        margin-left: 5px;
    } 
    .pannel{
        height:250px;
    }   
    .pannel img{
        width:100%;
        line-height: 250px;
    }
</style>
<template>
<div>
	<div class="layout-content-filtrate">
		<Form label-position="right" :label-width="100">
			<row>
				<Col span="7">
					<Form-item label="车牌号:">
						<Input v-model.trim="vpl_number" placeholder="输入车牌号"></Input>
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
        <row>
            <Col span="7">
                <Card class="pannel">
                    <img v-if="carInfo.picture" :src="carInfo.picture"/>
                </Card>            
            </Col>
            <Col span="17">
                <Card dis-hover class="pannel">
                    <row class="carInfo">
                        <Col span="8">
                            <p>车牌号:<span>{{carInfo.vpl_number}}</span></p> 
                            <p>UID:<span>{{carInfo.uid}}</span></p>
                            <p>车品牌:<span>{{carInfo.brand}}</span></p>
                            <p>车颜色:<span>{{carInfo.color}}</span></p>                                                                                                                        	                            
                            <p>手机号:<span>{{carInfo.mobile}}</span></p>
                            <p>是否APP用户:<span>{{carInfo.is_app==1? '是':'否'}}</span></p>
                            <p>是否微信用户:<span>{{carInfo.is_wechat==1? '是':'否'}}</span></p>
                        </Col>
                        <Col span="8">
                            <p>当前状态:<span>{{carInfo.curr_status==1? '场内':'场外'}}</span></p> 
                            <p>	最后停车时间:<span>{{this.transformDate(carInfo.last_time)}}</span></p>
                            <p>	最后停车费用:<span>{{this.isInvaild(carInfo.last_charge/100)+'元'}}</span></p>
                            <p>	最后停车场:<span>{{this.transform(carInfo.last_park_code)}}</span></p>                                                                                                                        	                            
                            <p>是否授权车:<span>{{carInfo.is_auth==1? '是':'否'}}</span></p>
                            <p>停车费用总金额:<span>{{this.isInvaild(carInfo.total_charge/100)+'元'}}</span></p>
                            <p>停车总次数:<span>{{carInfo.total_parking}}</span></p>                        
                        </Col>
                        <Col span="8">
                            <p>最常去停车场:<span>{{this.transform(carInfo.max_park_code)}}</span></p> 
                            <p>最长停车时长:<span>{{this.formatSeconds(carInfo.max_parking_time)}}</span></p>
                            <p>最高停车费:<span>{{this.isInvaild(carInfo.max_charge/100)+'元'}}</span></p>
                            <!--单独处理内容过长换行导致定格显示的问题-->
                            <div style="width:115px;float:left;">
                                <p>最常使用的支付方式:</p>
                            </div>
                            <div style="width:calc(100% - 120px);float: right;">
                                <p>{{this.transformPayWay(carInfo.max_charge_type)}}</p>
                            </div>                         
                        </Col>
                    </row>
                </Card>              
            </Col>            
        </row>

		<Table border :columns="table.columns" :data="table.data" style="margin-top:40px;"></Table>	
	</div>
</div> 
</template>

<script>
import {getCarUserDetail} from '../../../api/situation';
import DateFormat from '../../../commons/utils/formatDate.js';

  export default {
    data () {
        return {
            vpl_number:'',
            table: {
                columns: [
                    {
                        title: '进场时间',
                        key: 'in_time'
                    },
                    {
                        title: '出场时间',
                        key: 'out_time'
                    },
                    {
                        title: '停车时长',
                        key: 'parking_duration'
                    },   
                    {
                        title: '停车费用',
                        key: 'parking_charge'
                    }, 
                    {
                        title: '停车场',
                        key: 'park'
                    }, 
                    {
                        title: '支付方式',
                        key: 'payWay'
                    }, 
                    {
                        title: '是否授权车',
                        key: 'is_auth'
                    },																																																                    
                ],
                data:[]                    
            },
            carInfo: {
                brand: '',
                color: '',
                curr_status: '',
                is_app: '',
                is_auth: '',
                is_wechat: '',
                last_charge: '',
                last_park_code: '',
                last_time: '',
                max_charge: '',
                max_charge_type: '',
                max_park_code: '',
                max_parking_time: '',
                total_charge: '',
                total_parking: '',
                uid: '',
                vpl_number: '',
                picture:'',
            }
        }
    },
	computed: {
        parkList () {
		    return JSON.parse(sessionStorage.getItem('parkList')) || [];	
        },     
	},	
	mounted () {
		if(this.$route.query.num){
			this.vpl_number = decodeURI(this.$route.query.num);
            this.getCarUserDetail(this.$route.query.num)
		}
	},	     	    
    methods: {
        query () {
            if(this.vpl_number.length==0 || !this.isVehicleNumber(this.vpl_number)){
                this.$Message.warning('请输入正确的车牌号')
                return
            }
            this.getCarUserDetail(this.vpl_number)
        },
        getCarUserDetail (param) {
            return getCarUserDetail(encodeURI(param)).then(res => {
                if(res.status ==200 && res.data.message=='ok'){
                    this.carInfo = res.data.data
                    this.handleTableData(res.data.data)
                } else{
                    this.$Message.error(res.data.message);
                }
            });
        },  
        handleTableData(res) {
            let tableShowData = Object.assign([], res.records),rowData = [];
            for(let item in tableShowData.reverse()) {
                let raw = {
                    in_time:this.transformDate(tableShowData[item].in_time),
                    out_time:this.transformDate(tableShowData[item].out_time),
                    parking_duration:this.formatSeconds(tableShowData[item].parking_duration),
                    parking_charge:`${this.isInvaild(tableShowData[item].parking_charge/100)}元`,
                    park:this.transform(tableShowData[item].park_code),
                    is_auth:tableShowData[item].is_auth==1? '是':'否',
                    payWay:this.transformPayWay(tableShowData[item].charge_type)
                }
                rowData.push(raw);
            }
            this.table.data = rowData;
        },    
        //将车场对应的code转换为名称
        transform(code) {
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
        //时间转换
        transformDate(date) {
            if(date.length==0 || date==0){
                return ''
            }
            return DateFormat.format(new Date(date*1000), 'yyyy-MM-dd hh:mm')	
        }, 
        isInvaild(val) {
            if(!isFinite(val)) {
                return ''
            }
            return val.toFixed(2)
            //Math.round(val)
        },
        //支付方式转换  
        transformPayWay (code) {
            let StrArr = code.toString().split(',')
            if(StrArr.length==0 || code=='-1'){
                return ''
            }
            let dictionary = ['短时免费','现金','后支付','线上银联','在线支付','纸质小时券','电子小时券','授权车免费','手动免费开闸',
            '自动抬杆时间放行','储值划扣','封顶放行','提前支付预留时间放行','会员积分支付','公交卡支付','储时划扣','电子优惠券金额券',
            '电子优惠券免次券','电子优惠券时段免费券','纸质优惠券金额券','权益卡次数','电子折扣券','纸质折扣券','权益卡金额','权益卡时间'
            ,'','','','','','','','','','','','','','','','','','','','','','','电子通用金额券','微信','支付宝','线下银联pos','纸质次数券'
            ,'计费免费','第三方微信','第三方支付宝','第三方其他支付','第三方金额积分支付','第三方金额优惠券支付','折扣抵扣金额','线上优惠券金额'
            ,'停车王钱包','ETC支付','翼支付','财付通','ApplePay','快钱','易付宝','云网支付',
            ]
            if(StrArr.length==1){
                return dictionary[code]
            } else{
                let arr=[];
                for(let i in StrArr){
                    arr.push(dictionary[parseInt(StrArr[i])])
                }
                return arr.join(',')
            }
            
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
        //秒转时分
        formatSeconds(value) {  
            let theTime = parseInt(value);// 秒
            let theTime1 = 0;// 分
            let theTime2 = 0;// 小时
            if(theTime > 60) {  
                theTime1 = parseInt(theTime/60);  
                theTime = parseInt(theTime%60);  
                    if(theTime1 > 60) {  
                    theTime2 = parseInt(theTime1/60);  
                    theTime1 = parseInt(theTime1%60);  
                    }  
            }   
            let result = "";
            if(parseInt(theTime)){
                result = ""+parseInt(theTime)+"秒";
            }
            if(theTime1 > 0) {  
                result = ""+parseInt(theTime1)+"分钟"+result;  
            }  
            if(theTime2 > 0) {  
                result = ""+parseInt(theTime2)+"小时"+result;  
            }  
            return result;  
        }                                                       
    }
}
</script>
