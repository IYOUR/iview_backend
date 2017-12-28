<style scoped>
    .layout-content-filtrate{
		padding: 15px;
		margin-bottom: -20px;
    }
    .filtrate-title{
		text-align: center;
		font-size: 14px;
		height: 32px;
    	line-height: 32px;
	}
	.currentDate{
		text-align: center;
		font-size: 1.5vw;
    	font-weight: bold;
	}
	.datePicker{
		width:100%;
	}
</style>
<template>
	<div class="layout-content-filtrate">
		<Form :model="queryData" label-position="right" :label-width="100">
			<row>
				<Col span="2" class="filtrate-title">
					<span>条件选择:</span>
				</col>
				<Col span="7">
					<Form-item label="选择日期:">
						<Date-picker class="datePicker" v-model="queryData.date" format="yyyy/MM/dd" type="daterange" :options="disableDate" placement="bottom-start" placeholder="开始时间 - 结束时间 "></Date-picker>
					</Form-item>	
				</col>
				<Col span="7">
					<Form-item label="终端:">
						<Select v-model="queryData.city" @on-change="" clearable placeholder="请选择">
							<Option value="null" v-if="!showCity" disabled>暂无数据</Option>
							<Option v-if="showCity"  v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
						</Select>
					</Form-item>							
				</col>
				<Col span="7">					
					<Form-item>
						<row :gutter="16">
							<Col span="12">
								<Button @click="query" type="primary" style="width:100%;">查询</Button>
							</Col>
							<Col span="12">
								<Button @click="reset" type="ghost"  style="width:100%;">重置</Button>
							</Col>
						</row>	
					</Form-item>			
				</col>
			</row>	
		</Form>
	</div>
</template>
<script>
    import * as situationService from '../../api/situation';
	import CONSTANT from '../../commons/utils/code';
	import DateFormat from '../../commons/utils/formatDate';
	import {mapState, mapActions, mapGetters} from 'vuex';
	import axios from 'axios';
    export default {
		data() {
			return {
				disableDate: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now()-86400000;
                    }					
				},
				showCity:false,
				showPark:false,
				resultData: {}
			}
		},
		computed: {
            ...mapState({
                provinceList: 'provinceList',
                companyList: 'companyList',
				parkList: 'parkList',
				cityList: 'cityList',
				queryData: 'queryData'
            }),					
		},
        mounted () {
			
        },
        watch: {
            'cityList':{
				immediate: true,
                handler(newVal,oldVal){
					if(newVal.length>0) {
						this.showCity = true;
					} else 
					this.showCity = false;
                },
            },			
        },
		methods: {
            ...mapActions({
                getProvinceList: 'getProvinceList',
				getCompanyList: 'getCompanyList',
				getParkLists: 'getParkLists'
            }),			
			selectProvince(value) {
				if(value !==''){
					this.getCityList({levelType:'2',parent:value});
					this.getParkList({province:value})	
				}
			},		
			//点击查询
			query() {
				axios.get('/iop/parks').then(res => {
					console.log(res)
				})			
			},
			//点击重置
            reset() {
				let data = {
					province: '',
					park_code: '',
					city: '',
					date: [],
					company: ''
				};
				this.$store.commit('SET_QUERY_DATA',data);
				this.$store.commit('SET_CITY_LIST',[]);
				this.$store.commit('SET_PARK_LIST',[])
            },
																								
		},  		
    }
</script>