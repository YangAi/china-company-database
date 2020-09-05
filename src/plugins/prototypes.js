import Vue from 'vue'
import utils from './utils.js'
import lodash from 'lodash'
import api from '@/services/api'
import config from '@/../config'
import localForage from '@/plugins/localForage'

Vue.prototype.$utils = utils
Vue.prototype._ = lodash
Vue.prototype.$api = api
Vue.prototype.$config = config
Vue.prototype.$forage = localForage
