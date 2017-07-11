<style scoped>
	.container{
		margin: 15px;
	}
</style>
<template>
<div class="container">
    <Tabs type="card">
        <Tab-pane label="更新配置信息">
			<edit-config></edit-config>
		</Tab-pane>
        <Tab-pane label="更新控制台">更新控制台</Tab-pane>
    </Tabs>
</div>
</template>
<script>
import editConfig from './components/editConfig.vue'

export default {
    components: {
        'edit-config': editConfig,
    }     
}
</script>