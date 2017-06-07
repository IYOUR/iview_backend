<style scoped>
    .tableButton{
        margin-bottom: 15px;
    }
</style>
<template>
	<div>
		<Row class="tableButton">
			<Col span="2" offset="20">
				<Button type="ghost" @click="isHidden = !isHidden" v-if="isHidden">隐藏表格</Button>
                <Button type="ghost" @click="isHidden = !isHidden" v-if="!isHidden">显示表格</Button>
			</Col>
			<Col span="2">
				<Button type="primary">导出Excel</Button>
			</Col>
		</Row>
		<Table v-show="isHidden" border :columns="tableData.columns1" :data="tableData.data1"></Table>	
	</div>
</template>
<script>

    export default {
        props: {
            tableShowdata: {
            type: Object,
            required: true
            }
        },
        data (){
            return {
                tableData: this.tableShowdata,
                isHidden: true
            }
        }
    }
</script>