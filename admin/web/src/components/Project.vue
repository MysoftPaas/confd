<template>
  <div class="container">
    <spinner :show="loading"></spinner>
    <h1 v-if="info" class="title is-3">
      {{ info.project.Name }}
    </h1>

    <table v-if="info" class="table">
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
          <input :class="{'is-danger':!input.key && submit}" v-model="input.key" class="input" type="text" placeholder="key" required>
        </p>
      </div>
      <div class="column is-two-third">
        <label class="label">Value</label>
        <p class="control">
          <textarea v-model="input.value" class="input" rows="1" placeholder="value" required></textarea>
        </p>
      </div>
    </div>
    <div class="columns">
      <div class="column is-one-third">
        <button :class="{'is-loading': startSet}" class="button is-fullwidth is-primary" @click="upset()">SET</button>
      </div>
      <div class="column is-one-third">
        <button class="button is-fullwidth is-dark" @click="execute()">EXECUTE</button>
      </div>
      <div class="column is-one-third">
        <button class="button is-fullwidth" @click="remove()">DELETE</button>
      </div>
    </div>

    <div>


    <article class="message">
      <div class="message-header">
        <nav class="level log-tools">
                <div class="level-left">
                  <a class="level-item" href="javascript:void(0);" @click="hideLog()">
                    <span class="icon is-small">
                      <i :class="['fa', loggingVisiable ? 'fa-angle-double-up' : 'fa-angle-double-down' ]"></i>
                     </span>
                  </a>
                  <a class="level-item" href="javascript:void(0);" @click="cleanLog()">
                    <span class="icon is-small"><i class="fa fa fa-ban"></i></span>
                  </a>
                </div>
              </nav>
        Logging Screen
      </div>
      <div id="loggingBody" v-html="loggingBody" v-if="loggingVisiable" class="message-body">
      </div>
    </article>

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
/* global ws Ws */
import { http, ui, utils } from '../common'
import Spinner from './Spinner.vue'

export default {
  name: 'project',
  components: { Spinner },
  data () {
    return {
      submit: false,
      startSet: false,
      startDelete: false,
      startExecute: false,
      loggingVisiable: false,
      items: [],
      input: { key: '', value: '' },
      selectedIndex: -1,
      info: null,
      loading: false,
      name: this.$route.params.name,
      loggingBody: ''
    }
  },
  methods: {
    fetchData () {
      var self = this
      self.loading = true
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
    },

    isSelected (key) {
      return this.input.key === key
    },

    upset () {
      var self = this
      this.submit = true
      if (!self.input.key) {
        return
      }
      this.startSet = true
      http.post('/api/project/' + self.name + '/items', {
        'key': self.input.key,
        'value': self.input.value
      }, function (response) {
        self.startSet = false
        if (response.data.result) {
          self.items[self.input.key] = self.input.value
          ui.alert('成功', '设置成功', 'success')
        } else {
          ui.alert('失败', response.data.msg, 'error')
        }
      })
    },

    remove () {
      this.submit = true
      var self = this
      if (!self.input.key) {
        return
      }
      var key = self.input.key
      ui.confirm('delete', 'delete ' + key + '?', function () {
        var projectName = utils.getQuery('name')
        var encodedKey = encodeURIComponent(key)
        http.delete('/api/project/' + projectName + '/item/' + encodedKey, function (response) {
          if (response.data.result) {
            self.items[key] = ''
            ui.alert('成功', '删除成功', 'success')
          } else {
            ui.alert('失败', response.data.msg, 'error')
          }
        })
      })
    },

    execute () {
      var self = this
      http.post('/api/exec', {
        'projectName': self.name
      }, function (response) {
        if (response.data.result) {
          ui.alert('成功', '执行成功', 'success')
        } else {
          ui.alert('失败', response.data.msg, 'error')
        }
      })
    },

    hideLog () {
      this.loggingVisiable = !this.loggingVisiable
    },

    cleanLog () {
      this.loggingBody = ''
    },

    log (message) {
      this.loggingBody += message + '\n'
    },

    viewLog () {
      ws.Emit('log', 'history')
    }

  },
  watch: {
    '$route': 'fetchData'
  },
  created () {
    if (this.info == null) {
      this.fetchData()
    }
    var self = this
    var HOST = window.location.host
    var ws = new Ws('ws://' + HOST + '/log')
    ws.OnConnect(function () {
      self.loggingBody = 'Websocket connection enstablished.'
    })

    ws.OnDisconnect(function () {
      self.loggingBody = 'Websocket disconnection.'
    })

    ws.On('log', function (message) {
      self.loggingBody += message + '</br>\r\n'
    })
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
.log-tools {
  float: right;
}
.log-tools a:hover {
  color: #fff;
}
</style>
