import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'

Vue.use(Vuex)

Vue.config.productionTip = false

import { state, getters, mutations, actions } from './store';

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
})

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
