import _ from 'lodash'
import Vue from 'vue'
import { staticRoutes } from '@/router'
import store from '@/store'
/**
 * 返回属性设置函数
 *
 * @param {*} config
 */
function setCompProps(config) {
  return () => {
    const { response } = store.state.router
    let props = { lib: config.lib, libProps: {} }
    /**
     * 路由定义中指定的属性
     */
    props.libProps = {}
    if (Array.isArray(config.defaultProps)) {
      config.defaultProps.reduce(
        (props, { propName, value }) =>
          propName ? Object.assign(props, { [propName]: value }) : props,
        props.libProps
      )
    }
    /**
     * 响应结果中获得属性
     */
    if (response) {
      if (true === config.responseProps) Object.assign(props.libProps, response)
      else if (Array.isArray(config.responseProps)) {
        config.responseProps.reduce(
          (props, { propName, shareKey }) =>
            propName
              ? _.set(props, propName, _.get(response, shareKey))
              : props,
          props.libProps
        )
      }
    }

    if (Array.isArray(config.views)) props.views = config.views

    return props
  }
}
function setMultiCompsRoute(route) {
  route.components = {}
  route.props = {}
  for (let name in route.onlineComponents) {
    route.components[name] = Vue.component('comp-route')
    route.props[name] = setCompProps(route.onlineComponents[name])
  }
}
function setCompRoute(route) {
  let Comp = Vue.component('comp-route')
  route.component = Comp
  route.props = setCompProps(route.onlineComponent)
}
function setCompLayout(route) {
  let Comp = Vue.component(route.layoutComponent.name)
  route.component = Comp
  route.props = () => {
    const props = {}
    Object.assign(props, route.layoutComponent.defaultProps)
    return props
  }
}
/**
 * Check asynchronous routing tables by recursion
 * @param routes asyncRoutes
 */
export function checkAsyncRoutes(routes) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (tmp.children) {
      tmp.children = checkAsyncRoutes(tmp.children)
    }
    if (
      typeof tmp.layoutComponent === 'object' &&
      typeof tmp.layoutComponent.name === 'string'
    ) {
      // 布局
      setCompLayout(tmp)
    } else if (
      typeof tmp.onlineComponent === 'object' &&
      typeof tmp.onlineComponent.lib === 'object' &&
      typeof tmp.onlineComponent.lib.url === 'string'
    ) {
      // 单组件
      setCompRoute(tmp)
    } else if (typeof tmp.onlineComponents === 'object') {
      // 多组件
      setMultiCompsRoute(tmp)
    }

    res.push(tmp)
  })

  return res
}

const state = {
  response: null,
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = staticRoutes.concat(routes)
  },
  SET_RESPONSE: (state, response) => {
    state.response = response
  }
}

const actions = {
  generateRoutes({ commit }) {
    return Vue.$apis.router.routes().then(routes => {
      routes = checkAsyncRoutes(routes)
      commit('SET_ROUTES', routes)
      return routes
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
