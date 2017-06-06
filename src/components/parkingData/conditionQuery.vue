<style scoped>
    .layout-content-filtrate{
		padding: 15px;
		margin-bottom: -20px;
    }
    .filtrate-title{
		text-align: center;
		font-size: 14px;
	}
</style>
<template>
	<div class="layout-content-filtrate">
		<row>
			<Col span="2" class="filtrate-title">
				<span>条件选择:</span>
			</col>
			<Col span="7">
				<Form label-position="right" :label-width="100">
					<Form-item label="省份:">
						<Select placeholder="请选择">
							<Option value="beijing">北京市</Option>
							<Option value="shanghai">上海市</Option>
							<Option value="shenzhen">深圳市</Option>
						</Select>
					</Form-item>
					<Form-item label="停车场:">
						<Select placeholder="请选择">
							<Option value="beijing">北京市</Option>
							<Option value="shanghai">上海市</Option>
							<Option value="shenzhen">深圳市</Option>
						</Select>
					</Form-item>
				</Form>
			</col>
			<Col span="7">
				<Form label-position="right" :label-width="100">
					<Form-item label="城市:">
						<Select placeholder="请选择">
							<Option value="beijing">北京市</Option>
							<Option value="shanghai">上海市</Option>
							<Option value="shenzhen">深圳市</Option>
						</Select>
					</Form-item>
					<Form-item label="选择日期:">
						<Date-picker format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="开始时间 - 结束时间 "></Date-picker>
					</Form-item>
				</Form>				
			</col>
			<Col span="7">
				<Form label-position="right" :label-width="100">
					<Form-item label="集团:">
						<Select placeholder="请选择">
							<Option value="beijing">北京市</Option>
							<Option value="shanghai">上海市</Option>
							<Option value="shenzhen">深圳市</Option>
						</Select>
					</Form-item>
					<Form-item>
						<row :gutter="16">
							<Col span="12">
								<Button type="primary" style="width:100%;">查询</Button>
							</Col>
							<Col span="12">
								<Button type="ghost"  style="width:100%;">重置</Button>
							</Col>
						</row>	
					</Form-item>
				</Form>				
			</col>
		</row>	
	</div>
</template>
<script>

    export default {

    }
</script>