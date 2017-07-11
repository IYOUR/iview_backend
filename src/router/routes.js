import VueRouter from 'vue-router'
import Vue from 'vue'
import Login from '../views/Login.vue'
import NotFound from '../views/404.vue'
import Home from '../views/Home.vue'
import Situation from '../views/parkingData/situation/situation.vue'
import RealTimeData from '../views/parkingData/realTimeData/realTimeData.vue'
import ParkingDetail from '../views/parkingData/parkingDetail/parkingDetail.vue'
import PaymentDetail from '../views/parkingData/paymentDetail/paymentDetail.vue'
import AppConfig from '../views/operation/appConfig/appConfig.vue'
let routes = [{
        path: '/login',
        component: Login,
        name: 'login',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '汇总',
    },
    {
        path: '/',
        component: Home,
        name: '停车场数据',
        children: [
            { path: '/situation', component: Situation, name: '停车场数据概况' },
            { path: '/realTimeData', component: RealTimeData, name: '实时数据' },
            { path: '/parkingDetail', component: ParkingDetail, name: '停车数据详情' },
            { path: '/paymentDetail', component: PaymentDetail, name: '支付数据详情' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'C端数据',
        // leaf: true, //只有一个节点
        // children: [
        //     { path: '/page6', component: Page6, name: '页面6' }
        // ]
    },
    {
        path: '/',
        component: Home,
        name: '优惠券数据',
        // children: [
        //     { path: '/echarts', component: echarts, name: 'echarts' }
        // ]
    },
    {
        path: '/',
        component: Home,
        name: '运营功能',
        children: [
           { path: '/appConfig', component: AppConfig, name: 'App更新配置' },
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

Vue.use(VueRouter)
const router = new VueRouter({
    routes
})

export default router;