import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import state from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

import result from './modules/result'
import income from './modules/income'
import loan from './modules/loan'
import saving from './modules/saving'
import expense from './modules/expense'

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    modules: { result, income, loan, saving, expense },
    plugins: [createPersistedState({
        key: 'simple-budget',
        paths: ['currentLanguage', 'expense', 'income', 'loan', 'result', 'saving', 'selectedPeriod', 'storageName', 'key']
    })]
})