(function(exports) {
    'use strict'
    var _httpErrorHandle = function(response) {

        if (response.status == 401) {
            window.location.href = "/static/login.html";
        } else if (response.status == 500) {
            ui.hideLoading()
            ui.alert('出错', '服务器端错误', 'error')
        }
        console.log(response);
    };
    exports.ui = {

        confirm: function(title, msg, onApprove) {

            swal({
                title: title,
                text: msg,
                type: "warning",
                showCancelButton: true,
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            }, function() {
                onApprove();
            });

        },
        prompt: function(title, msg, placeholder, cb) {
            swal({
                title: title,
                text: msg,
                type: "input",
                showCancelButton: true,
                closeOnConfirm: false,
                inputPlaceholder: "Write something"
            }, function(inputValue) {
                if (inputValue === false) return false;
                if (inputValue === "") {
                    swal.showInputError("You need to write something!");
                    return false
                }
                cb(inputValue);
            });
        },
        loading: function() {
            // $('.container').addClass('active');
        },
        hideLoading: function() {
            //$('.container').removeClass('active');
        },
        alert: function(title, msg, type) {
            swal(title, msg, type);
        }
    };
    exports.config = {
        apiHost: '',
        init: function() {
            var token = window.localStorage.getItem('token') || "";
            Vue.http.options.root = '';
            Vue.http.headers.common['Authorization'] = "Bearer " + token;
            Vue.http.options.emulateJSON = true;
        }
    };
    exports.utils = {

        getQuery: function(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        },
        post: function(path, data, successCallback, errorCallback) {
            Vue.http.post(path, data).then(function(response) {
                successCallback(response);
                ui.hideLoading()
            }, function(response) {
                if (errorCallback) {
                    errorCallback(response);
                }
                _httpErrorHandle(response);
            });
        },
        delete: function(path, successCallback, errorCallback) {
            Vue.http.delete(path).then(function(response) {
                successCallback(response);
                ui.hideLoading()
            }, function(response) {
                if (errorCallback) {
                    errorCallback(response);
                }
                _httpErrorHandle(response);
            });
        },
        get: function(path, successCallback, errorCallback) {
            Vue.http.get(path).then(function(response) {
                successCallback(response);
                ui.hideLoading()
            }, function(response) {
                if (errorCallback) {
                    errorCallback(response);
                }
                _httpErrorHandle(response);
            });
        }

    };


})(window)
