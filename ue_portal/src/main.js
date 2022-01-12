import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {
  TmsAxiosPlugin,
  TmsErrorPlugin,
  TmsIgnorableError,
  TmsEventPlugin,
  TmsLockPromise
} from 'tms-vue'
import ApiPlugin from './apis'
import auth from './apis/auth'
import { Frame, Flex, CompOnline, Login } from 'tms-vue-ui'
import ElementUI, { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/common.scss'

import CompRoute from './components/CompRoute.vue'
import NamedRouterViews from './components/NamedRouterViews.vue'

import TransferPlugin from './utils/transfer'
import { setToken, getToken, removeToken } from './global.js'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(Frame).use(Flex)
Vue.use(TmsAxiosPlugin)
  .use(TmsErrorPlugin)
  .use(TmsEventPlugin)
Vue.use(TransferPlugin)

Vue.component('comp-route', CompRoute)
Vue.component('comp-online', CompOnline)
Vue.component('named-router-views', NamedRouterViews)

Vue.prototype.$getToken = getToken
Vue.prototype.$removeToken = removeToken

/**
 * 初始化
 */
function onResultFault(res) {
  Message({
    showClose: true,
    message: res.data.msg,
    type: 'error',
    duration: 3000
  })
  return Promise.reject(new TmsIgnorableError(res.data))
}
// 处理请求过程中发生的异常
function onResponseRejected(err) {
  return Promise.reject(new TmsIgnorableError(err))
}
let rules = []
/**
 * 用户认证
 */
if (
  process.env.VUE_APP_AUTH_DISABLED !== 'Yes' &&
  process.env.VUE_APP_AUTH_SERVER
) {
  const { fnGetCaptcha, fnGetJwt } = auth
  const LoginSchema = [
    {
      key: process.env.VUE_APP_LOGIN_KEY_USERNAME || 'username',
      type: 'text',
      placeholder: '用户名'
    },
    {
      key: process.env.VUE_APP_LOGIN_KEY_PASSWORD || 'password',
      type: 'password',
      placeholder: '密码'
    },
    {
      key: process.env.VUE_APP_LOGIN_KEY_PIN || 'pin',
      type: 'code',
      placeholder: '验证码'
    }
  ]
  Vue.use(Login, { schema: LoginSchema, fnGetCaptcha, fnGetToken: fnGetJwt })
  /**
   * 请求中需要包含认证信息
   */
  const fnOnFail = () => {
    Message({
      showClose: true,
      message: '登录失败',
      type: 'error',
      duration: 2000,
      customClass: 'tms-login__error'
    })
  }
  const LoginPromise = (function() {
    let login = new Login(LoginSchema, fnGetCaptcha, fnGetJwt)
    let ins = new TmsLockPromise(function() {
      return login.showAsDialog(fnOnFail).then(token => {
        setToken(token)
        return `Bearer ${token}`
      })
    })
    return ins
  })()

  const getAccessToken = function() {
    // 如果正在登录，等待结果
    if (LoginPromise.isRunning()) {
      return LoginPromise.wait()
    }
    // 如果没有token，发起登录
    let token = getToken()
    if (!token) {
      return LoginPromise.wait()
    }

    return `Bearer ${token}`
  }

  const onRetryAttempt = function(res) {
    if (res.data.code === 20001) {
      return LoginPromise.wait().then(() => {
        return true
      })
    }
    return false
  }

  if (process.env.VUE_APP_AUTH_SERVER) {
    let accessTokenRule = Vue.TmsAxios.newInterceptorRule({
      requestHeaders: new Map([['Authorization', getAccessToken]]),
      onRetryAttempt
    })
    rules.push(accessTokenRule)
  }
}

let tmsAxiosRule = Vue.TmsAxios.newInterceptorRule({
  onResultFault,
  onResponseRejected
})
rules.push(tmsAxiosRule)

const tmsAxios = {}
tmsAxios.default = Vue.TmsAxios({ name: 'default-api', rules })
if (
  process.env.VUE_APP_AUTH_DISABLED !== 'Yes' &&
  process.env.VUE_APP_AUTH_SERVER
) {
  tmsAxios.auth = Vue.TmsAxios({ name: 'auth-api' })
}
Vue.use(ApiPlugin, { tmsAxios })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
