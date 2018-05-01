import axios from 'axios';

const Util = {
  imgPath: 'http://127.0.0.1:8011/img/',
  apiPath: 'http://127.0.0.1:8010',
  preZero: function (num) {
    return num * 1 < 10 ? '0' + num : num ;
  }
};

// Ajax 通用配置
Util.ajax = axios.create({
  baseURL: Util.apiPath
});

// 添加响应拦截器
Util.ajax.interceptors.response.use( res => {
  return res.data;
});

// 获取当天0点0分0秒的时间戳
Util.getTodayTime = function () {
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date.getTime();
};

// 当前日期格式化20180501
Util.prevDay = function ( timestamp = (new Date()).getTime() ) {
  const date = new Date( timestamp );
  const year = date.getFullYear();
  const month = this.preZero( date.getMonth() + 1 );
  const day = this.preZero( date.getDate() );
  return year + '' + month + '' + day;
}

export default Util;
