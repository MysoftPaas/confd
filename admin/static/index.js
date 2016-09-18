(function(exports) {
    'use strict'
    exports.app = function(elId) {
        return new Vue({
            paths: {
                get: config.apiHost + '/api/projects'
            },
            el: '#' + elId,
            data: {
                items: [],
            },
            methods: {
                search: function() {},
                loadData: function() {
                    var self = this
                    var path = self.$options.paths.get;
                    axios.get(path)
                        .then(function(response) {
                            ui.hideLoading()
                            if (response.data.result === false) {
                                ui.alert('出错', response.data.msg, 'error')
                            }
                            self.items = response.data;
                        })
                        .catch(function(err) {
                            ui.hideLoading()
                            ui.alert('出错', '服务器端错误', 'error')
                            console.log(err)
                        })
                }
            },
            filters: {
                //moment: function(timestamp) {
                //return moment(timestamp).format('YY-MM-DD HH:mm:ss')
                //}
            },
            ready: function() {
                ui.loading()
                console.log('ready ..')
                this.loadData()
            }
        })
    };

})(window)
