<template>
<section class="hero is-fluid is-light">
  <!-- Hero header: will stick at the top -->
  <div class="hero-head">
    <header class="nav">
      <div class="container">
        <div class="nav-left">
          <router-link class="nav-item"  to="/">
            confd admin
          </router-link>
        </div>
        <div class="nav-right nav-menu">
          <router-link class="nav-item" to="/dashboard">
            Dashboard
          </router-link>
          <router-link class="nav-item is-active" v-if="loggedIn" to="/logout">Log out</router-link>
          <router-link class="nav-item is-active" v-if="!loggedIn" to="/login">Log in</router-link>
          <span class="nav-item">
            <a href="https://github.com/MysoftPaas/confd">
              <span class="icon">
                <i class="fa fa-github"></i>
              </span>
              <span></span>
            </a>
          </span>
        </div>
      </div>
    </header>
  </div>

  <!-- Hero content: will be in the middle -->
  <div id="app" class="hero-body">
      <router-view class="view"></router-view>
  </div>

  <!-- Hero footer: will stick at the bottom -->
  <div class="hero-foot">
    <nav class="tabs">
      <div class="container">
        <ul>
          <li class="is-active"><a>Overview</a></li>
          <li><a>Modifiers</a></li>
          <li><a>Grid</a></li>
          <li><a>Elements</a></li>
          <li><a>Components</a></li>
          <li><a>Layout</a></li>
        </ul>
      </div>
    </nav>
  </div>
</section>
</template>

<script>
import auth from '../auth'
export default {
  data () {
    return {
      loggedIn: auth.loggedIn()
    }
  },
  created () {
    auth.onChange = loggedIn => {
      this.loggedIn = loggedIn
    }
  }
}
</script>

<style>
</style>
