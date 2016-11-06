<template>
  <div class="container">
    <h1 class="title is-3">
      {{ info.project.Name }}
    </h1>

    <table class="table">
      <tbody>
        <tr>
          <td class="tag label">prefix</td>
          <td>{{ info.project.Prefix }}</td>
        </tr>
        <tr>
          <td class="tag label">confDir</td>
          <td>{{ info.project.ConfDir }}</td>
        </tr>
      </tbody>
    </table>

    <div class="columns">
      <div class="column is-one-third">
        <label class="label">Key</label>
        <p class="control">
          <input v-model="input.key" class="input" type="text" placeholder="key">
        </p>
      </div>
      <div class="column is-two-third">
        <label class="label">Value</label>
        <p class="control">
          <textarea v-model="input.value" class="input" rows="1" placeholder="value"></textarea>
        </p>
      </div>
    </div>
    <div class="columns">
      <div class="column is-one-third">
        <button class="button is-fullwidth is-primary">SET</button>
      </div>
      <div class="column is-one-third">
        <button class="button is-fullwidth" >DELETE</button>
      </div>
      <div class="column is-one-third">
        <button class="button is-fullwidth is-success" >EXECUTE</button>
      </div>
    </div>

    <div>

     <table class="table is-bordered">
      <thead>
          <tr>
            <th style="width:33%">key</th>
            <th style="width:67%">value</th>
          </tr>
        </thead>
          <tbody>
            <tr class="green" v-bind:id="'row-'+key" v-for="(value, key) in items"
             @click="select($event, key, value)"
            :class="{ 'actived': isSelected(key) }"
            >
              <td>{{ key }}</td>
              <td>{{ value }}</td>
            </tr>
          </tbody>
        </table>

    </div>

  </div>
</template>

<script>
import { http } from '../common'

export default {
  name: 'project',
  data () {
    return {
      items: [],
      input: { key: '', value: '' },
      selectedIndex: -1,
      info: null,
      loading: false,
      name: this.$route.params.name
    }
  },
  methods: {
    fetchData () {
      var self = this
      self.loading = true
      self.info = {project: {Name: '', Prefix: ''}, resources: []}
      http.get('/api/project/' + self.name, function (response) {
        self.info = { project: response.data.project, resources: [] }
      })
      http.get('/api/project/' + self.name + '/items', function (response) {
        self.loading = false
        self.items = response.data
      })
    },

    select (event, key, value) {
      this.input.key = key
      this.input.value = value
      console.log('select ' + key)
    },

    isSelected (key) {
      return this.input.key === key
    }
  },
  watch: {
    '$route': 'fetchData'
  },
  created () {
    if (this.info == null) {
      this.fetchData()
    }
  }
}
</script>

<style>
.actived {
  background-color:#00d1b2;
  color: #ffffff;
}

.table tr.green:hover {
  background-color: #00d1b2;
  color: #fff;
}
</style>
