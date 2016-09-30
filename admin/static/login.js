(function(exports) {
    'use strict'
    exports.app = function(elId) {
        return new Vue({
            el: '#' + elId,
            data: {
                username: "",
                password: "",
            },
            methods: {
                login: function(item) {
                    self = this;
                    axios.post(config.apiHost + '/api/login', {
                            "username": username,
                            "password": password
                        })
                        .then(function(response) {
                            if (response.data.result) {
                                localStorage.setItem('token', response.data.token);
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
