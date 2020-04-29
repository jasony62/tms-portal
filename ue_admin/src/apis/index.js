import createRoute from './route'

function init(options) {
  return {
    route: createRoute(options.tmsAxios.route)
  }
}

export default function install(Vue, options) {
  Vue.$apis = init(options)
  Vue.prototype.$apis = Vue.$apis
}
