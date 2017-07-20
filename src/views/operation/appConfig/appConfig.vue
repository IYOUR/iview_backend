<style scoped>
	.container{
		margin: 0px;
	}
</style>
<template>
<div class="container">
    <Tabs type="card" v-model="activeTab">
        <Tab-pane name="editconfig" label="更新配置信息">
			<edit-config v-show="!previewInfo.state"></edit-config>
            <perview-config v-show="previewInfo.state"></perview-config>
		</Tab-pane>
        <Tab-pane name="editconlist" label="更新控制台">
            <config-list></config-list>
        </Tab-pane>
    </Tabs>
    
</div>
</template>
<script>
import editConfig from './components/editConfig.vue'
import configList from './components/configList.vue'
import perviewConfig from './components/perviewConfig.vue'
import {mapState, mapActions, mapGetters} from 'vuex';
export default {
    data () {
        return{
            activeTab: 'editconfig',
        }
    },
    watch: {
        'editConfigData':{
            deep:true,
            handler:function(newVal,oldVal){
                this.activeTab = 'editconfig';
            },
        }
    },        
    computed: {
        ...mapState({
            editConfigData: 'editConfigData',
            previewInfo: 'previewInfo'
        }),	
    },
    methods:{
    },
    components: {
        'edit-config': editConfig,
        'config-list': configList,
        'perview-config': perviewConfig,
    },     
}
</script>