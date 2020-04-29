import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Luyou from '../views/Luyou.vue'
import LuyouList from '../components/LuyouList.vue'
import LuyouEditor from '../components/LuyouEditor.vue'
import Zujan from '../views/Zujian.vue'

Vue.use(VueRouter)

const routes = [
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

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
