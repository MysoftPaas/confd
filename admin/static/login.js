(function(exports) {
    'use strict'
    exports.app = function(elId) {
        return new Vue({
            el: '#' + elId,
            data: {
                form: {
                    username: '',
                    password: '',
                }
            },
            methods: {
                login: function() {
                    self = this;
                    utils.post(config.apiHost + '/api/login', {
                        "username": self.form.username,
                        "password": self.form.password
                    }, function(response) {
                        if (response.data.result) {
                            window.localStorage.setItem('token', response.data.token);
                            window.location.href = "/";
                        } else {
                            ui.alert('失败', response.data.msg, 'error')
                        }

                    });
                },
            },
            mounted: function() {
                console.log('ready ..')
            }
        })
    };

})(window)
