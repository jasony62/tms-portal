import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { TmsAxiosPlugin, TmsErrorPlugin, TmsIgnorableError } from 'tms-vue'
import ApiPlugin from './apis'
import { Frame, Flex, CompOnline } from 'tms-vue-ui'
import ElementUI, { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import CompRoute from './components/CompRoute.vue'
import NamedRouterViews from './components/NamedRouterViews.vue'

import TransferPlugin from './utils/transfer'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(Frame).use(Flex)
Vue.use(TmsAxiosPlugin).use(TmsErrorPlugin)
Vue.use(TransferPlugin)

Vue.component('comp-route', CompRoute)
Vue.component('comp-online', CompOnline)
Vue.component('named-router-views', NamedRouterViews)

/**
 * 初始化
 */
function onResultFault(res) {
  Message({
    showClose: true,
    message: res.data.msg,
    type: 'error',
    duration: 0
  })
  return Promise.reject(new TmsIgnorableError(res.data))
}
const rules = []

const tmsAxiosRule = Vue.TmsAxios.newInterceptorRule({
  onResultFault
})
rules.push(tmsAxiosRule)

const tmsAxios = {}
tmsAxios.default = Vue.TmsAxios({ name: 'default-api', rules })
Vue.use(ApiPlugin, { tmsAxios })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
