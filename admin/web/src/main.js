import Vue from 'vue'
import App from './components/App.vue'
import 'bulma'
import VueRouter from 'vue-router'
import {router} from './routes'
import VueResource from 'vue-resource'
import auth from './auth'

Vue.use(VueRouter)
Vue.use(VueResource)
// use application/x-www-form-urlencoded
Vue.http.options.emulateJSON = true
Vue.http.headers.common['Authorization'] = 'Bearer ' + auth.getToken()

/* eslint-disable no-new */
new Vue({
  router,
  http: {
    root: '/'
  },
  template: '<App/>',
  components: { App }
}).$mount('#app')
