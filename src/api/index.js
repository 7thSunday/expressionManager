import axios from 'axios'
import qs from 'qs'

// axios 配置
axios.defaults.timeout = 10000000;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL='/mainWeb/gexpr'
axios.defaults.transformRequest = [(data,config)=>{
  if(!config['Content-Type']) return qs.stringify(data);
  switch(config['Content-Type'].toLowerCase()) {
  case 'application/json;charset=utf-8': {
    return JSON.stringify(data);
  }
  case 'multipart/form-data;charset=utf-8': {
    return data;
  }
  default: {
    return qs.stringify(data);
  }
  }
}]
/**
 * 请求之前可以做什么
 */
// axios.interceptors.request.use((config) => {
//   //post请求序列化
//   if (config.method === 'post') {
//     config.data = qs.stringify(config.data);
//   }
//   return config; //添加这一行
// }, (error) => {
//   return Promise.reject(error);
// });

/**
 * 返回拦截，可以做些什么
 */
axios.interceptors.response.use((res) => {
  if(res.status===200){
    return Promise.resolve(res.data)
  }

}, (error) => {
  return Promise.reject(error)
}
)
export default {
  // mpdata:(data)=>axios.get('/user',data),
  fetchGlobalExpressionTree: data=>axios.get('/listTree',data),
  fetchGlobalExpression: data=>axios.get('/list',data),
  fetchAllCategorys: data=>axios.get('/listAllCategorys',data),
  saveGlobalExpression: data=>axios.post('/save',data),
  saveGlobalExpressionCategory: data=>axios.get('/saveCategory',data),
  deleteGlobalExpressionTreeNode: data=>axios.post('/delete',data),
  fetchGlobalExpressionById: data=>axios.get('/findById',data),
  importGlobalExpression: (data,config)=>axios.post('/import',data,config),
  exportGlobalExpression: data=>axios.get('/export',data)
}

