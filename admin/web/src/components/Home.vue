<template>
<section class="hero is-primary">
  <div class="hero-body">
    <div class="container">
      <h1 class="title">
        Confd Admin 2016
          <router-link to="/view/dashboard"><i class="fa fa-arrow-right"></i>
          </router-link>
      </h1>
      <h2 class="subtitle">
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
