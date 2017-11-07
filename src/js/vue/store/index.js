import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import state from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

import budget from './modules/budget'
import income from './modules/income'
import loan from './modules/loan'
import saving from './modules/saving'
import expense from './modules/expense'

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    modules: { budget, income, loan, saving, expense },
    plugins: [createPersistedState({
        key: 'simple-budget'
    })]
})