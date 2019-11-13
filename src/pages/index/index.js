import Vue from "vue"
import App from "./index.vue"
import store from "@/store"
// 引入sgui组件库
import "southgisui/lib/sgui-theme/index.css"
import sgui from "southgisui"
// import SgLayout from 'southgisui/lib/layout/index.js'
// 引入系统样式表
import "@/assets/scss/common"
import "@/assets/icon/iconfont.css"
import '@/assets/icon/iconfont'
import '@/assets/scss/style'
Vue.use(sgui)
// Vue.use(SgLayout)
// 设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount("#index")
