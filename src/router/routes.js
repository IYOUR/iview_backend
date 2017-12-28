import VueRouter from 'vue-router'
import Vue from 'vue'
import Login from '../views/Login.vue'
import NotFound from '../views/404.vue'
import Home from '../views/Home.vue'
import Parksituation from '../views/parkingData/situation/situation.vue'
import RealTimeData from '../views/parkingData/realTimeData/realTimeData.vue'
import ParkingDetail from '../views/parkingData/parkingDetail/parkingDetail.vue'
import PaymentDetail from '../views/parkingData/paymentDetail/paymentDetail.vue'
//import AppConfig from '../views/operation/appConfig/appConfig.vue'
//import Clientsituation from '../views/clientData/situation/situation.vue'

// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow.so only in production use Lazy Loading
const _import = require('./_import_' + process.env.NODE_ENV);
const Permission = _import('user/permission');
const Clientsituation = _import('clientData/situation/situation');
const AppConfig = _import('operation/appConfig/appConfig');
const Network = _import('performance/network/network');
const ErrorDetail = _import('performance/network/errorDetail');
const OnlinePay = _import('performance/onlinePay/onlinePay');
const UserCenter = _import('repository/userCenter/userCenter');
const CarDetail = _import('repository/userCenter/carDetail');
const ParkCenter = _import('repository/parkCenter/parkCenter');
const ParkDetail = _import('repository/parkCenter/parkDetail');

let routes = [
    {
        path: '/login',
        component: Login,
        name: 'login',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '404',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: 'permission',
        text: '权限管理',
        hidden: true,
        children: [
            { path: '/permission', component: Permission, name: '权限管理',hidden: true},
         ]        
    },    
    {
        path: '/',
        component: Home,
        name: 'parkingData',
        text: '停车数据',
        children: [
            { path: '/parksituation', component: Parksituation, name: 'parksituation', text: '数据总览',hidden: false},
            { path: '/realtime', component: RealTimeData, name: 'realtime',text: '实时数据',hidden: false},
            { path: '/parkingdetail', component: ParkingDetail, name: 'parkingdetail', text: '停车统计',hidden: false},
            { path: '/paymentdetail', component: PaymentDetail, name: 'paymentdetail', text: '支付统计',hidden: false},
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'clientSituation',
        text: '车主数据',
        children: [
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'operation',
        text: '平台运营',
        children: [
           { path: '/appconfig', component: AppConfig, name: 'appconfig', text: 'APP更新',hidden: false},
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'performance',
        text: '性能监控',
        children: [
           { path: '/network', component: Network, name: 'network', text: '下发监控',hidden: false},
           { path: '/onlinepay', component: OnlinePay, name: 'onlinepay', text: '在线支付监控',hidden: false},
           { path: '/errordetail', component: ErrorDetail, name: 'errordetail', text: '下发失败详情',hidden: true},
        ]
    }, 
    {
        path: '/',
        component: Home,
        name: 'repository',
        text: '数据仓库',
        children: [
            { path: '/usercenter', component: UserCenter, name: 'usercenter', text: '用户中心',hidden: false},  
            { path: '/cardetail', component: CarDetail, name: 'cardetail', text: '用户详情',hidden: true},   
            { path: '/parkcenter', component: ParkCenter, name: 'parkcenter', text: '车场中心',hidden: false},  
            { path: '/parkdetail', component: ParkDetail, name: 'parkdetail', text: '车场详情',hidden: true},                                            
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
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: routes 
})

export default router;