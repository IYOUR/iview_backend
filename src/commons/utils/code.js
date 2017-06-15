/**
 * @file code
 * Created by haner on 2017/4/25.
 * @brief
 */
import CommonState from '../../store/commonState';

//状态
export const HTTP_STATUS = {
    SUCCESS: {
        CODE: '200',
        MSG: ''
    },
    ERROR: {
        CODE: '0',
        MSG: ''
    },
    SERVER_ERROR: {
        CODE: '2',
        MSG: '服务器开小差！请稍后再试哦~'
    },
    VALID_TOKEN: {
        CODE: '401',
        MSG: '用户信息已失效，需重新登录！'
    },
};

export default {
    PAGE_SIZE: CommonState.PAGER.page_items,
    HTTP_STATUS:HTTP_STATUS,
};