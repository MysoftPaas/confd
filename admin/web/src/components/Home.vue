<template>
<section class="hero is-primary">
  <div class="hero-body">
    <div class="container">
      <h1 class="title">
        Confd Admin
      </h1>
      <h2 class="subtitle">
          <router-link class="nav-item" to="/dashboard">Start</router-link>
      </h2>
    </div>
  </div>
</section>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>
