<style scoped>
    .layout-content-filtrate{
		padding: 15px;
		margin-bottom: -20px;
    }
    .filtrate-title{
		text-align: center;
		font-size: 14px;
	}
	.currentDate{
		text-align: center;
		font-size: 1.5vw;
    	font-weight: bold;
	}
</style>
<template>
	<div class="layout-content-filtrate">
		<Form :model="queryParam" label-position="right" :label-width="100">
			<row>
				<Col span="2" class="filtrate-title">
					<span>条件选择:</span>
				</col>
				<Col span="7">
					<Form-item label="省份:">
						<Select v-model="queryParam.province" placeholder="请选择">
							<Option v-for="item in cityList" :value="item.value" :key="item">{{ item.label }}</Option>
						</Select>
					</Form-item>
					<Form-item label="停车场:">
						<Select v-model="queryParam.park_code" placeholder="请选择">
							<Option v-for="item in cityList" :value="item.value" :key="item">{{ item.label }}</Option>
						</Select>
					</Form-item>
				</col>
				<Col span="7">
					<Form-item label="城市:">
						<Select v-model="queryParam.city" placeholder="请选择">
							<Option v-for="item in cityList" :value="item.value" :key="item">{{ item.label }}</Option>
						</Select>
					</Form-item>
					<Form-item label="选择日期:">
						<Date-picker v-model="queryParam.date" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="开始时间 - 结束时间 "></Date-picker>
					</Form-item>								
				</col>
				<Col span="7">			
					<Form-item label="集团:">
						<Select v-model="queryParam.group_code" placeholder="请选择">
							<Option v-for="item in cityList" :value="item.value" :key="item">{{ item.label }}</Option>
						</Select>
					</Form-item>
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
    import * as ParkService from '../../api/situation';
    export default {
		data() {
			return {
				queryParam: {
					province: '',
					park_code: '',
					city: '',
					date: [],
					group_code: ''
				},
                cityList: [
                    {
                        value: 'beijing',
                        label: '北京市'
                    },
                    {
                        value: 'shanghai',
                        label: '上海市'
                    },
                    {
                        value: 'shenzhen',
                        label: '深圳市'
                    },
                    {
                        value: 'hangzhou',
                        label: '杭州市'
                    },
                    {
                        value: 'nanjing',
                        label: '南京市'
                    },
                    {
                        value: 'chongqing',
                        label: '重庆市'
                    }
                ],
				provinceList: []
			}
		},
		computed: {
			datePicker: function() {
				return this.$route.path==='/realTimeData'?true:false;
			}
		},
        created () {
			// this.getParksList().then(() => {
			// 	this.setDefault();
			// 	this.query();
			// });
        },		
		methods: {
			//点击查询
			query() {
				for (let item in this.queryParam) {
					if(this.queryParam[item].length === 0) {
						this.$Message.warning('请选择查询数据!');
						return;
					}
				};	
				console.log(this.paramsProcess())	
			},
			//点击重置
            reset () {
				this.queryParam = {
					province: '',
					park_code: '',
					city: '',
					date: [],
					group_code: ''
				}
            },
			//格式化日期
            changeDate(now){
                let year = now.getFullYear();
                let month = now.getMonth() + 1;
                let date = now.getDate();
                return year + "-" + month + "-" + date;
            },
            //参数处理
            paramsProcess(){
                let queryParam = Object.assign({}, this.queryParam), params = {};
                params.province = queryParam.province;
                params.park_code = queryParam.province;
				params.city = queryParam.city;
				params.group_code = queryParam.group_code;
				params.query_date_start = this.changeDate(queryParam.date[0]);
                params.query_date_end = this.changeDate(queryParam.date[1]);
                return params;
            },
            //获取车场列表
            getParksList() {
                return ParkService.getParksList(this.ParksListParams || {}).then(res => {
                    if (res.code !== this.HTTP_STATUS.SUCCESS.CODE) {
                        this.$Message.error(res.message || this.HTTP_STATUS.ERROR.MSG);
                        return;
                    };
                    let data = [];
                    for (let i = 0; i < res.data.length; i++) {
                        let obj = {};
                        obj.label = res.data[i].parking_name;
                        obj.value = res.data[i].park_code;
                        data[i] = obj;
                    };
                    this.carList = data;
                });
            },
			//设置默认参数
            setDefault(){
				this.queryParam.province = this.cityList[0].value;
                this.queryParam.date = [new Date(), new Date()];
                this.queryParam.park_code = this.cityList[0].value;
                this.queryParam.city = this.cityList[0].value;
                this.queryParam.group_code = this.cityList[0].value;
                return this.queryParam;
            },
			//获取查询结果
            getQueryResult() {
                TableService.getQueryResult(this.paramsProcess()).then(res => {
                    if (res.code !== this.HTTP_STATUS.SUCCESS.CODE) {
                        this.$Message.error(res.message || this.HTTP_STATUS.ERROR.MSG);
                        return;
                    };
                    //传递数据给父组件
					this.$emit('queryResult',res.data);
                });
            },															
		}

    }
</script>