import VueRouter from 'vue-router'
import auth from './auth'
import Project from './components/Project.vue'
import Home from './components/Home.vue'
import Login from './components/Login.vue'
import About from './components/About.vue'
import Hello from './components/Hello.vue'
import Dashboard from './components/Dashboard.vue'

function requireAuth (to, from, next) {
  if (!auth.loggedIn()) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

var router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Home, meta: { title: 'home' } },
    { path: '/about', component: About, meta: { title: 'about' } },
    { path: '/login', component: Login },
    {
      path: '/dashboard',
      component: Dashboard,
      beforeEnter: requireAuth
    },
    { path: '/project/:name', component: Project, beforeEnter: requireAuth },
    { path: '/hello', component: Hello, beforeEnter: requireAuth },
    {
      path: '/logout',
      beforeEnter (to, from, next) {
        auth.logout()
        next('/')
      }
    }
  ]
})

export {
  router
}
