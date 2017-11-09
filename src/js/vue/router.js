//Import vue, vue-router
import Vue from 'vue'
import VueRouter from 'vue-router'

//Import store
import store from './store/index'

//Import components
import index from './templates/index.vue'
import error404 from './templates/errors/404.vue'

import pageResult from './templates/pages/result.vue'
import pageIncome from './templates/pages/income.vue'
import pageLoan from './templates/pages/loan/index.vue'
import pageSaving from './templates/pages/saving.vue'
import pageExpense from './templates/pages/expense.vue'
import pageSettings from './templates/pages/settings.vue'

const router = new VueRouter({
    mode: 'history',
    linkActiveClass: 'active',
    routes: [
        { path: '/', component: index, name: 'index', children: [
            { path: 'result', component: pageResult, name: 'page.result' },
            { path: 'income', component: pageIncome, name: 'page.income' },
            { path: 'loan', component: pageLoan, name: 'page.loan' },
            { path: 'saving', component: pageSaving, name: 'page.saving' },
            { path: 'expense', component: pageExpense, name: 'page.expense' },
            { path: 'settings', component: pageSettings, name: 'page.settings' }
        ] },
        { path: '404', component: error404, name: 'error.404' }
    ]
})

export default router