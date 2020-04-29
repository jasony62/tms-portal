import Vue from 'vue'
import Vuex from 'vuex'
import router from './modules/router'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    router
  },
  getters
})

export default store
