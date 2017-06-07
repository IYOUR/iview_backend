<style scoped>
	.situation-item .number{
		text-align: center;
		font-size: 30px;
		padding: 10px;
	}
	.situation-item .comparison{
		font-size: 10px;;
	}
</style>
<template>
    <Row type="flex" justify="space-between" class="code-row-bg">
        <Col span="4">
            <div class="situation-item">
                <p>车位数量:</p>
                <p class="number"><span>12341</span></p>
                <p class="comparison">
                    <Row type="flex" justify="space-around" class="code-row-bg">
                        <Col span="10">
                            <table>
                                <tr>
                                    <td>前一天:</td>
                                    <td>1099</td>
                                </tr>
                                <tr>
                                    <td>同比上周:</td>
                                    <td>1099</td>
                                </tr>
                                <tr>
                                    <td>同比上月:</td>
                                    <td>1099</td>
                                </tr>																		
                            </table>								
                        </Col>
                        <Col span="10">
                            <table style="float:right;">
                                <tr>
                                    <td>环比:</td>
                                    <td>68%<Icon type="arrow-up-c"></Icon></td>
                                </tr>
                                <tr>
                                    <td>同比:</td>
                                    <td>32%<Icon type="arrow-up-c"></Icon></td>
                                </tr>
                                <tr>
                                    <td>同比:</td>
                                    <td>34%<Icon type="arrow-down-c"></Icon></td>
                                </tr>																		
                            </table>								
                        </Col>
                    </Row>		
                </p>
            </div>
        </Col>
        <Col span="4">col-4</Col>
        <Col span="4">col-4</Col>
        <Col span="4">col-4</Col>
        <Col span="4">col-4</Col>
    </Row>
</template>
<script>

    export default {
        // props: {
        //     situationData: {
        //     type: Object,
        //     required: true
        //     }
        // },
        // data (){
        //     return {
        //         situationPanelData: this.situationData
        //     }
        // }
    }
</script>