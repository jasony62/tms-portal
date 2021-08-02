import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../components/Login.vue'
import Luyou from '../views/Luyou.vue'
import LuyouList from '../components/LuyouList.vue'
import LuyouEditor from '../components/LuyouEditor.vue'
import Zujan from '../views/Zujian.vue'
import { TmsRouterHistoryPlugin } from 'tms-vue'
import { getToken } from '../global.js'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    name: '首页',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/luyou',
    name: 'Luyou',
    component: Luyou,
    children: [
      { path: '', component: LuyouList },
      { path: 'edit/:name/:version', component: LuyouEditor, props: true }
    ]
  },
  {
    path: '/zujian',
    name: 'Zujan',
    component: Zujan
  }
]

Vue.use(VueRouter).use(TmsRouterHistoryPlugin)

let router = new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'login') {
    let token = getToken()
    if (!token) {
      Vue.TmsRouterHistory.push(to.path)
      return next({ name: 'login' })
    }
  }
  next()
})

router = Vue.TmsRouterHistory.watch(router)

export default router
