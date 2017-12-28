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

//Vue.use(VueClipboard)
Vue.use(Vuex)
Vue.use(iview)


router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        sessionStorage.removeItem('userInfo');
        sessionStorage.removeItem('companyList');
        sessionStorage.removeItem('parkList');
    }
    let user = JSON.parse(unescape(sessionStorage.getItem('userInfo')));
    if (user && to.path != '/login') {
        let router = JSON.parse(user.router) || [];
        let isExist = (val)=>{
            return router.some((item)=>{
                return item.children.some((ele)=>{
                    return ele.name == val
                })
            })
        }
        if(user.adder==0){
            next()
        } else{
            if(to.name=='404'){
                next()
            }else{
                (isExist(to.name))? next():next({ path: '/404' });
            }
        }   
    } else {
        (to.path == '/login')? next():next({ path: '/login' })
    }
})

router.afterEach(transition => {
    setTimeout(()=>{
        if(document.getElementsByClassName("layout-content")[0])
            document.getElementsByClassName("layout-content")[0].scrollTop = 0;
    },200)
});

new Vue({
    el: '#app',
    template: '<App/>',
    router,
    store,
    components: { App }
    //render: h => h(Login)
}).$mount('#app')
