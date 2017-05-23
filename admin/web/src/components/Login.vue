<template>
<form @submit.prevent="login" class="container is-fluid">
  <h1 class="title is-3" v-if="$route.query.redirect">You need to login first.</h1>
  <label class="label">username</label>
  <p class="control">
    <input v-model="username" class="input" type="text" placeholder="username">
  </p>
  <label class="label">password</label>
  <p class="control has-icon has-icon-right">
    <input v-model="password" class="input" type="password" placeholder="password">
  </p>
  <p class="control">
    <button class="button is-primary" type="submit">login</button>
    <span v-if="error" class="help is-danger">Login failed.</span>
  </p>
</form>
</template>

<script>
import auth from '../auth'
export default {
  data () {
    return {
      username: '',
      password: '',
      error: false
    }
  },
  methods: {
    login () {
      auth.login(this.username, this.password, loggedIn => {
        if (!loggedIn) {
          this.error = true
        } else {
          this.$router.replace(this.$route.query.redirect || '/')
        }
      })
    }
  }
}
</script>
