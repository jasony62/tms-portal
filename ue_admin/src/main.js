import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {
  TmsAxiosPlugin,
  TmsErrorPlugin,
  TmsIgnorableError,
  TmsEventPlugin,
  TmsLockPromise
} from 'tms-vue'
import ApiPlugin from './apis'

Vue.config.productionTip = false
Vue.use(TmsAxiosPlugin).use(TmsErrorPlugin).use(TmsEventPlugin)
/**
 * 初始化全局组件TmsObjectInput
 */
import {
  Button,
  Input,
  Collapse,
  CollapseItem,
  Card,
  Message
} from 'element-ui'
import { ObjectInput, Flex, ElJsonDoc, Login } from 'tms-vue-ui'
import auth from './apis/auth'

Vue.use(Button).use(Input).use(Collapse).use(CollapseItem).use(Card)
Vue.use(Flex)
Vue.component('tms-el-json-doc', ElJsonDoc)

ObjectInput.setComponent('layout.root', 'tms-flex', {
  props: {
    direction: 'column'
  }
})
ObjectInput.setComponent('layout.lines', 'el-collapse')
ObjectInput.setComponent('layout.line', 'el-collapse-item.tms-flex', {
  'tms-flex': {
    props: {
      direction: 'column'
    }
  }
})
ObjectInput.setComponent('layout.line-index', 'div', {
  style: {
    display: 'none'
  }
})
ObjectInput.setComponent('layout.line-key', 'el-input')
ObjectInput.setComponent('layout.line-buttons', 'el-card')
ObjectInput.setComponent('button.add', 'el-button', {
  props: {
    type: 'primary'
  }
})
ObjectInput.setComponent('button.empty', 'el-button', {
  props: {
    type: 'danger'
  }
})
ObjectInput.setComponent('button.remove', 'el-button', {
  props: {
    size: 'mini',
    icon: 'el-icon-minus'
  }
})
ObjectInput.setComponent('button.moveup', 'el-button', {
  props: {
    size: 'mini',
    icon: 'el-icon-caret-top'
  }
})
ObjectInput.setComponent('button.movedown', 'el-button', {
  props: {
    size: 'mini',
    icon: 'el-icon-caret-bottom'
  }
})
Vue.component('tms-object-input', ObjectInput)

/**
 * 初始化
 */
function onResultFault(res) {
  Message({ showClose: true, message: res.data.msg, type: 'error', duration: 3000 })
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
if (process.env.VUE_APP_AUTH_DISABLED !== 'Yes' && process.env.VUE_APP_AUTH_SERVER) {
  const { fnGetCaptcha, fnGetJwt } = auth
  const LoginSchema = [
    {
      key: process.env.VUE_APP_LOGIN_KEY_USERNAME || 'username',
      type: 'text',
      placeholder: '用户名'
    }, {
      key: process.env.VUE_APP_LOGIN_KEY_PASSWORD || 'password',
      type: 'password',
      placeholder: '密码'
    }, {
      key: process.env.VUE_APP_LOGIN_KEY_PIN || 'pin',
      type: 'code',
      placeholder: '验证码'
    }
  ]
  Vue.use(Login, { schema: LoginSchema, fnGetCaptcha, fnGetToken: fnGetJwt })
  /**
 * 请求中需要包含认证信息
 */
  const LoginPromise = (function () {
    let login = new Login(LoginSchema, fnGetCaptcha, fnGetJwt)
    let ins = new TmsLockPromise(function () {
      return login.showAsDialog().then(token => {
        sessionStorage.setItem('access_token', token)
        return `Bearer ${token}`
      })
    })
    return ins
  })()

  const getAccessToken = function () { // 如果正在登录，等待结果
    if (LoginPromise.isRunning()) {
      return LoginPromise.wait()
    }
    // 如果没有token，发起登录
    let token = sessionStorage.getItem('access_token')
    if (!token) {
      return LoginPromise.wait()
    }

    return `Bearer ${token}`
  }

  const onRetryAttempt = function (res) {
    if (res.data.code === 20001) {
      return LoginPromise.wait().then(() => {
        return true
      })
    }
    return false
  }

  if (process.env.VUE_APP_AUTH_SERVER) {
    let accessTokenRule = Vue.TmsAxios.newInterceptorRule({
      requestHeaders: new Map(
        [['Authorization', getAccessToken]]
      ),
      onRetryAttempt
    })
    rules.push(accessTokenRule)
  }
}

let tmsAxiosRule = Vue.TmsAxios.newInterceptorRule({ onResultFault, onResponseRejected })
rules.push(tmsAxiosRule)


const tmsAxios = {}
tmsAxios.route = Vue.TmsAxios({ name: 'route-api', rules })
if (process.env.VUE_APP_AUTH_DISABLED !== 'Yes' && process.env.VUE_APP_AUTH_SERVER) {
  tmsAxios.auth = Vue.TmsAxios({ name: 'auth-api' })
}
Vue.use(ApiPlugin, { tmsAxios })

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
