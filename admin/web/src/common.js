import Vue from 'vue'

function httpErrorHandle (response) {
  console.log(response)
}

var utils = {
  getQuery (name, url) {
    if (!url) url = window.location.href
    name = name.replace(/[[]]/g, '\\$&')
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
    var results = regex.exec(url)
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
  }
}

/* global swal */
var ui = {

  alert (title, msg, type) {
    swal(title, msg, type)
  },

  confirm (title, msg, onApprove) {
    swal({
      title: title,
      text: msg,
      type: 'warning',
      showCancelButton: true,
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      onApprove()
    })
  },

  prompt (title, msg, placeholder, cb) {
    swal({
      title: title,
      text: msg,
      type: 'input',
      showCancelButton: true,
      closeOnConfirm: false,
      inputPlaceholder: 'Write something'
    }, function (inputValue) {
      if (inputValue === false) return false
      if (inputValue === '') {
        swal.showInputError('You need to write something!')
        return false
      }
      cb(inputValue)
    })
  }
}

var http = {
  getQuery (name, url) {
    if (!url) url = window.location.href
    name = name.replace(/[[]]/g, '\\$&')
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
    var results = regex.exec(url)
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
  },

  post (path, data, successCallback, errorCallback) {
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
  http,
  ui,
  utils
}

