import Vue from 'vue'
import store from './store/index'
import VueI18n from 'vue-i18n'

import sv from '../../lang/sv'

const translations = { sv }

Vue.use(VueI18n)
Vue.config.lang = store.getters.getLanguage
Object.keys(translations).forEach(function (lang) {
  Vue.locale(lang, translations[lang])
})