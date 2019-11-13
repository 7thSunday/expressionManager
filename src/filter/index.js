import Vue from 'vue'
import {dateFormat} from '_src/libs/date.js'
/**
 * @Description: 第二个参数params无用。传参日期格式为format。有默认格式。
 * @author hjh
 * @date 2018/10/31
*/
Vue.filter('formatDate', (v, params, format) => {
  if(v){
    return dateFormat(new Date(v), format ? format : 'YYYY-MM-DD')
  }else{
    return '无期限';
  }
});
Vue.filter('propertyNameFilter',(params) => {
  if (params) {
    let name = params.split(',');
    if (name.length == 1) {
      return name[0]
    } else {
      return name[name.length - 2];
    }
  } else {
    return ''
  }
});
