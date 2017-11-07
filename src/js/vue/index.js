//Loading store, router and translations
import store from './store/index'
import translations from './translations'
import router from './router'
import directives from './directives'

//Initiate app
const app = new Vue({
    template: '<div id="app"><router-view></router-view></div>',
    el: '#app',
    store,
    router
});