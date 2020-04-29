import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { TmsAxiosPlugin } from 'tms-vue'
import ApiPlugin from './apis'

Vue.config.productionTip = false

Vue.use(TmsAxiosPlugin)
/**
 * 初始化全局组件TmsObjectInput
 */
import { Button, Input, Collapse, CollapseItem, Card } from 'element-ui'
import { ObjectInput, Flex, ElJsonDoc } from 'tms-vue-ui'

Vue.use(Button)
  .use(Input)
  .use(Collapse)
  .use(CollapseItem)
  .use(Card)
Vue.use(Flex)
Vue.component('tms-el-json-doc', ElJsonDoc)

ObjectInput.setComponent('layout.root', 'tms-flex', {
  props: { direction: 'column' }
})
ObjectInput.setComponent('layout.lines', 'el-collapse')
ObjectInput.setComponent('layout.line', 'el-collapse-item.tms-flex', {
  'tms-flex': { props: { direction: 'column' } }
})
ObjectInput.setComponent('layout.line-index', 'div', {
  style: { display: 'none' }
})
ObjectInput.setComponent('layout.line-key', 'el-input')
ObjectInput.setComponent('layout.line-buttons', 'el-card')
ObjectInput.setComponent('button.add', 'el-button', {
  props: { type: 'primary' }
})
ObjectInput.setComponent('button.empty', 'el-button', {
  props: { type: 'danger' }
})
ObjectInput.setComponent('button.remove', 'el-button', {
  props: { size: 'mini', icon: 'el-icon-minus' }
})
ObjectInput.setComponent('button.moveup', 'el-button', {
  props: { size: 'mini', icon: 'el-icon-caret-top' }
})
ObjectInput.setComponent('button.movedown', 'el-button', {
  props: { size: 'mini', icon: 'el-icon-caret-bottom' }
})
Vue.component('tms-object-input', ObjectInput)

const tmsAxios = {}
tmsAxios.route = Vue.TmsAxios({ name: 'route-api' })
Vue.use(ApiPlugin, { tmsAxios })

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
