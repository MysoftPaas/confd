(function(exports) {
    'use strict'
    exports.app = function(elId) {
        return new Vue({
            el: '#' + elId,
            data: {
                items: [],
                currentProject: {
                    project: null,
                    resources: []
                },
                apiHost: config.apiHost,
            },
            methods: {
                search: function() {},
                loadData: function() {
                    var self = this
                    axios.get(config.apiHost + '/api/projects')
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
                },
                selectProject: function(proj) {
                    var self = this;
                    self.currentProject.project = proj
                    axios.get(config.apiHost + '/api/project/' + proj.Name)
                        .then(function(response) {
                            console.log(response.data);
                            ui.hideLoading();
                            self.currentProject.resources = response.data.resources;

                        }).catch(function(err) {
                            ui.hideLoading()
                            ui.alert('出错', '服务器端错误', 'error')
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
