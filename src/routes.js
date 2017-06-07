import Login from './pages/Login.vue'
import NotFound from './pages/404.vue'
import Home from './pages/Home.vue'
import Main from './pages/Main.vue'
import Table from './pages/total/Table.vue'
import Form from './pages/total/Form.vue'
import user from './pages/total/user.vue'
import Situation from './pages/parkingData/situation.vue'
import RealTimeData from './pages/parkingData/realTimeData.vue'
import ParkingDetail from './pages/parkingData/parkingDetail.vue'
import PaymentDetail from './pages/parkingData/paymentDetail.vue'
import Page6 from './pages/cPortData/Page6.vue'
import echarts from './pages/couponData/echarts.vue'

let routes = [{
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '汇总',
        children: [
            { path: '/main', component: Main, name: '主页'},
            // { path: '/table', component: Table, name: '表格' },
            // { path: '/form', component: Form, name: '表单' },
            // { path: '/user', component: user, name: '列表' },
        ]
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
        children: [
            { path: '/page6', component: Page6, name: '页面6' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '优惠券数据',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;