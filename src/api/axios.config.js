
import axios from 'axios';
import Storage from '../commons/utils/storage';
import {getUser} from './user';

import CONSTANT from '../commons/utils/code';
import router from '../router/routes';

import {LoadingBar,Message} from 'iview';

//api 地址配置
// axios.PARK_API = process.env.NODE_ENV === 'production' ? 'http://180.97.80.42:8788/api/' : 'api/';
//axios.PARK_API = 'http://180.97.81.222:8788/api/';
axios.PARK_API ='api/';
var iTime;
//请求拦截器
axios.interceptors.request.use(config => {
        //LoadingBar.start();
        let method = config.method.toLocaleLowerCase();
        if (method === 'post') {
            // console.log(Storage.KEYS.userToken)
            // 判断是否存在token，如果存在的话，则每个http header都加上token
            // config.headers.token = Storage.KEYS.userToken;
            // config.data = processParam(config.data);
            // let user = getUser();
            // user && user.token && (config.data['token'] = user.token);
                config.headers.token = sessionStorage.getItem('token');
                config.params = config.params || {};
            return config;
        }

        if (method === 'get') {
            if(config.url.indexOf('api')>=0) {
                LoadingBar.start();
            }            
          // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.token = sessionStorage.getItem('token');
            config.params = config.params || {};
            return config;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

//响应拦截器
axios.interceptors.response.use(response => {
        if(response.config.url.indexOf('api')>=0) {
            LoadingBar.finish();
        }

        return response;
    },
    error => {
        LoadingBar.finish();

        if (error.response.status == '401') {
            router.replace({name: 'login'})
            //消息防抖
            clearTimeout(iTime);
            iTime = setTimeout(function () {
                Message.error('登录已过期，请重新登录!')
            }, 300); 
            return Promise.reject(error)
        }    
        //消息防抖
        clearTimeout(iTime);
        iTime = setTimeout(function () {
            Message.error('服务器开小差了，请重稍后再试!')
        }, 300);

        return Promise.reject(error)
    }
);

//参数处理
function processParam(params) {
    if (!params) {
        return {}
    }
    Object.keys(params).forEach((key) => {
        if (params[key] !== 0 && !params[key]) delete params[key];
    });
    return params;
}

