/**
 * @file home
 * Created by haner on 2017/3/30.
 */

import Mock from 'mockjs';

/**
 * 首页列表
 */
Mock.mock(
  '/index.php/iop/parks', {
    "code": "1",
    "message": "success",
    "data": [
      {
        "park_code": "8300000004",
        "status": "0",
        "parking_name": "乌鲁木齐北京路新发大厦停车场",
        "space_total": "600",
        "space_empty": "558",
        "update_time": "2016-10-08 11:28:30"
      },
      {
        "park_code": "8300000007",
        "status": "0",
        "parking_name": "乌鲁木齐友好集团骏景嘉园小区",
        "space_total": "300",
        "space_empty": "300",
        "update_time": "2016-10-08 11:28:52"
      }
    ]
}
);

export default Mock;
