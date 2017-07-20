/**
 * @file index
 * Created by haner on 2017/3/30.
 * @brief mock 数据入口文件
 */

import Mock from 'mockjs';

import './park';

Mock.setup({
  timeout: '300-1000'
});


export default Mock;
