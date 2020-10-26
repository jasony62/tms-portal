import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export const staticRoutes = []

const createRouter = () =>
  new VueRouter({
    mode: 'history',
    base: process.env.VUE_APP_BASE_URL,
    routes: staticRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
