import createRouter from './route'

function init(options) {
  return {
    router: createRouter(options.tmsAxios.default)
  }
}

export default function install(Vue, options) {
  Vue.$apis = init(options)
  Vue.prototype.$apis = Vue.$apis
}
