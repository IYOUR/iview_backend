/**
 * @file Storage
 * Created by haner on 2017/3/30.
 * @brief 本地存储工具
 */

export default Storage = (function () {
    return {
        KEYS: {
            USER: 'com.parkingwang.iop.user',
            CURRENT_PARK: 'com.parkingwang.iop.user.active.park',
            userToken: 'c09a0eab245319981ab05af3d9e9f21a'
        },
        get: function (key, isSession) {
            if (!Storage.isLocalStorage()) {
                return undefined;
            }
            try {
                let value = Storage.getStorage(isSession).getItem(key);
                if (value) return JSON.parse(value);
            } catch (e) {
                console.log(e);
                return undefined;
            }
        },
        set: function (key, value, isSession) {
            if (!Storage.isLocalStorage()) {
                return undefined;
            }
            value = JSON.stringify(value);
            Storage.getStorage(isSession).setItem(key, value);
        },
        remove: function (key, isSession) {
            if (!Storage.isLocalStorage()) return undefined;
            Storage.getStorage(isSession).removeItem(key);
        },
        removeAll: function () {
            Object.keys(this.KEYS).forEach(key => {
                this.remove(this.KEYS[key]);
            });
        },
        getStorage: function (isSession) {
            return isSession ? sessionStorage : localStorage;
        },
        isLocalStorage: function () {
            try {
                if (!window.localStorage) {
                    console.warn('不支持本地存储');
                    return false;
                }
                return true;
            } catch (e) {
                console.warn('本地存储已关闭');
                return false;
            }
        }
    };
})();

