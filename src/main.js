//import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import store from './store'
import Vuex from 'vuex'
import './api/axios.config'; 
import router from './router/routes'
import Mock from './mock'
import iview from 'iview'
import 'iview/dist/styles/iview.css'
//import VueClipboard from 'vue-clipboard2'
import '../static/iconfont/iconfont.css';//iconfont

// Mock.bootstrap();

//Vue.use(VueClipboard)
Vue.use(Vuex)
Vue.use(iview)


router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        sessionStorage.removeItem('user');
    }
    let user = JSON.parse(sessionStorage.getItem('user'));
    if (!user && to.path != '/login') {
        next({ path: '/login' })
    } else {
        next()
    }
})

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
    el: '#app',
    template: '<App/>',
    router,
    store,
    components: { App }
    //render: h => h(Login)
}).$mount('#app')
