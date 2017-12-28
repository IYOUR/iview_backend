import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';

Vue.use(Vuex);

let store = new Vuex.Store({
  actions:actions,
  getters:getters,
  state:state,
  mutations:mutations,
  // plugins: [createLogger()],
});


export default store;
