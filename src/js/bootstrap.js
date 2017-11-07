//Import libraries
import Vue from 'vue'
import simpleVueValidation from 'simple-vue-validator'
import bootstrap from 'bootstrap'
//var jasnyBootstrap = require('jasny-bootstrap/dist/js/jasny-bootstrap');
import jasnyBootstrap from 'jasny-bootstrap/dist/js/jasny-bootstrap'
import axios from 'axios'
import _ from 'lodash'
import jQuery from 'jquery'
import selectize from 'selectize'
import chartJs from 'chart.js'
import firstBy from 'thenby'
import swal from 'sweetalert'

//Setting to window
window.Vue = Vue
window._ = _
window.Validator = simpleVueValidation.Validator
window.axios = axios
window.$ = window.jQuery = jQuery
window.swal = swal