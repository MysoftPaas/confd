import Vue from 'vue'
import App from './components/App.vue'
import 'bulma'
import VueRouter from 'vue-router'
import {router} from './routes'
import VueResource from 'vue-resource'

Vue.use(VueRouter)
Vue.use(VueResource)
// use application/x-www-form-urlencoded
Vue.http.options.emulateJSON = true

/* eslint-disable no-new */
new Vue({
  router,
  http: {
    root: '/'
  },
  template: '<App/>',
  components: { App }
}).$mount('#app')
