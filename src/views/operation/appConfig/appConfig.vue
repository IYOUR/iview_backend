<style scoped>
	.container{
		margin: 0px;
	}
</style>
<template>
<div class="container">
    <Tabs type="card">
        <Tab-pane label="更新配置信息">
			<edit-config></edit-config>
		</Tab-pane>
        <Tab-pane label="更新控制台">
            <config-list></config-list>
        </Tab-pane>
    </Tabs>
</div>
</template>
<script>
import editConfig from './components/editConfig.vue'
import configList from './components/configList.vue'

export default {
    components: {
        'edit-config': editConfig,
        'config-list': configList,
    }     
}
</script>