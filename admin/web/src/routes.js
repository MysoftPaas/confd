import VueRouter from 'vue-router'
import auth from './auth'
import Project from './components/Project.vue'
import Home from './components/Home.vue'
import Login from './components/Login.vue'
import About from './components/About.vue'
import Dashboard from './components/Dashboard.vue'

function requireAuth (to, from, next) {
  if (!auth.loggedIn()) {
    next({
      path: '/view/login',
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
    { path: '/view/about', component: About, meta: { title: 'about' } },
    { path: '/view/login', component: Login },
    {
      path: '/view/dashboard',
      component: Dashboard,
      beforeEnter: requireAuth
    },
    { path: '/view/project/:name', component: Project, beforeEnter: requireAuth },
    {
      path: '/view/logout',
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
