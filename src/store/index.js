/**
 * @file index
 * Created by haner on 2017/3/27.
 */

import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

import commonState from './commonState';

Vue.use(Vuex);

let store = new Vuex.Store({
  actions:actions,
  getters:getters,
  state:commonState,
  mutations:mutations,
  plugins: [createLogger()],
});


export default store;
