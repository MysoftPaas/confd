<template>
  <div class="container ">
    <h1 class="title is-3">
      Project List
    </h1>

    <spinner :show="loading"></spinner>
    <div class="columns">
      <div class="column is-half" >
        <div v-for="(project, index) in projects" class="box" :class="{ 'selected': isSelected(index) }" v-bind:id="'box-' + project.Name">
          <article class="media">
            <div class="media-left">
            </div>
            <div class="media-content">
              <div class="content">
                <p>
                <strong>{{ project.Name }}</strong> <small>Prefix: {{ project.Prefix }}</small>
                </p>
              </div>
              <nav class="level">
                <div class="level-left">
                  <a class="level-item" style="float:right!important;" :class="{ 'white': isSelected(index) }" v-on:click.stop.prevent="select($event, index, project)" >
                    <span class="icon" ><i  class="fa fa-chevron-circle-right"></i></span>
                  </a>
                  <router-link class="level-item" :class="{ 'white': isSelected(index) }" v-on:click.stop.prevent="select($event, index, project)"  v-bind:to="'/view/project/'+project.Name">
                    <span class="icon" ><i  class="fa fa-edit"></i></span>
                  </router-link>
                </div>
              </nav>
            </div>
          </article>
        </div>
      </div>

      <div class="column is-half">
        <div v-if="selectedProject">
          <h3 class="title is-3">{{ selectedProject.project.Name }}</h3>
          <table class="table">
            <tbody>
              <tr>
                <td class="tag label">prefix</td>
                <td>{{ selectedProject.project.Prefix }}</td>
              </tr>
              <tr>
                <td class="tag label">confDir</td>
                <td>{{ selectedProject.project.ConfDir }}</td>
              </tr>
            </tbody>
          </table>
          <h3 class="title is-5" style="margin-top: 20px;">Resources</h3>
          <table v-for="item in selectedProject.resources" class="table">
            <tbody>
              <tr>
                <td class="tag label">confDir</td>
                <td>{{ item.Prefix }}</td>
              </tr>
              <tr>
              <tr>
                <td class="tag label">src</td>
                <td>{{ item.Src }}</td>
              </tr>
              <tr>
                <td class="tag label">dest</td>
                <td>{{ item.Dest }}</td>
              </tr>
              <tr>
                <td class="tag label">keys</td>
                <td>
                  <ul>
                    <li class="row-line" v-for="key in item.Keys">{{ key }}</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { http } from '../common'
import Spinner from './Spinner.vue'

export default {
  name: 'Dashboard',
  components: { Spinner },
  data () {
    return {
      selectedIndex: -1,
      selectedProject: null,
      loading: false,
      error: null,
      projects: []
    }
  },
  methods: {
    fetchData () {
      var self = this
      self.loading = true
      http.get('/api/projects', function (response) {
        self.loading = false
        if (response.data.result === false) {
          self.error = response.data.msg
        } else {
          self.projects = response.data
        }
      })
    },

    select (event, index, project) {
      var self = this
      self.loading = true
      this.selectedIndex = index
      this.selectedProject = { project: project, resources: [] }
      http.get('/api/project/' + project.Name, function (response) {
        self.loading = false
        self.selectedProject.resources = response.data.resources
      })
    },

    isSelected (index) {
      return this.selectedIndex === index
    }
  },
  watch: {
    '$route': 'fetchData'
  },
  created () {
    this.fetchData()
  }
}
</script>
<style>
.selected {
  background-color: #00d1b2;
}
.white {
  color: #ffffff!important;
}
.row-line {
  border-bottom: solid 1px #ccc;
}
.table {
  padding: 5px!important;
}
td.tag, td.lable {
  width: 80px;
  float:left;
  background-color: whitesmoke!important;
  color: #000!important;
  padding: 10px;
  text-align: center;
  margin-left: 10px;
  margin-top: 10px;
}
.table tr:hover {
  background-color: #fff;
}
</style>
