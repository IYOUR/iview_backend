<style scoped>

</style>
<template>
    <Row>
        <Col span="8">
            <Form label-position="left" :label-width="100">
                <Form-item label="更新包路径:">
                    <Upload action="//jsonplaceholder.typicode.com/posts/">
                        <Button type="primary" icon="ios-cloud-upload-outline" long>上传文件</Button>
                    </Upload>
                </Form-item>
                <Form-item label="版本名称:">
                    <Input></Input>
                </Form-item>
                <Form-item label="版本号:">
                    <Input></Input>
                </Form-item>
                <Form-item label="覆盖版本号上限:">
                    <Input></Input>
                </Form-item>
                <Form-item label="覆盖版本号下限:">
                    <Input></Input>
                </Form-item>
                <Form-item label="MD5值:">
                    <Input></Input>
                </Form-item>  
                <Form-item label="产品线:">
                    <Radio-group>
                        <Radio label="KOP">KOP</Radio>
                        <Radio label="ECP">ECP</Radio>
                        <Radio label="IOP">IOP</Radio>
                    </Radio-group>
                </Form-item>
                <Form-item label="推荐策略:">
                    <Radio-group>
                        <Radio label="one">推荐更新</Radio>
                        <Radio label="two">强制更新</Radio>
                    </Radio-group>
                </Form-item>
                <Form-item label="弹窗策略:">
                    <Radio-group v-model="animal">
                        <Radio label="one">每次启动弹窗</Radio>
                        <Radio label="two">每天弹窗一次</Radio>
                        <Radio label="three">不弹窗</Radio>
                    </Radio-group>
                </Form-item>                                                                              
            </Form>
        </Col>
    </Row>

</template>
<script>
    export default {
        data () {
            return {
                animal: ''
            }
        }        
    }
</script>