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
                login: function(item) {
                    self = this;
                    axios.post('/api/login', {
                            "username": self.form.username,
                            "password": self.form.password
                        })
                        .then(function(response) {
                            if (response.data.result) {
                                window.localStorage.setItem('token', response.data.token);
                                ui.alert('成功', '设置成功', 'success');
                            } else {
                                ui.alert('失败', response.data.msg, 'error')
                            }

                        })
                        .catch(function(err) {
                            ui.hideLoading()
                            ui.alert('出错', '服务器端错误', 'error')
                        });
                },
            },
            ready: function() {
                console.log('ready ..')
            }
        })
    };

})(window)
