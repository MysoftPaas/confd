<template>
  <div class="container" >
    <div class="box is-primary" v-loading="isLoading">
      <ul>
        <li>one</li>
        <li>two</li>
      </ul>
    </div>
    <button @click="isLoading = true">load</button>
  </div>
</template>

<script>
import loading from './loading.js'
export default {
  directives: { loading },
  data () {
    return {
      isLoading: false
    }
  }

}
</script>

<style>
</style>
