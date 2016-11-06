import Vue from 'vue'

function httpErrorHandle (response) {
  console.log(response)
}

var http = {
  getQuery: function (name, url) {
    if (!url) url = window.location.href
    name = name.replace(/[[]]/g, '\\$&')
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
    var results = regex.exec(url)
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
  },

  post: function (path, data, successCallback, errorCallback) {
    Vue.http.post(path, data).then(function (response) {
      successCallback(response)
    }, function (response) {
      if (errorCallback) {
        errorCallback(response)
      }
      httpErrorHandle(response)
    })
  },

  delete (path, successCallback, errorCallback) {
    Vue.http.delete(path).then(function (response) {
      successCallback(response)
    }, function (response) {
      if (errorCallback) {
        errorCallback(response)
      }
      httpErrorHandle(response)
    })
  },

  get (path, successCallback, errorCallback) {
    Vue.http.get(path).then(function (response) {
      successCallback(response)
    }, function (response) {
      if (errorCallback) {
        errorCallback(response)
      }
      httpErrorHandle(response)
    })
  }

}

export {
  http
}

