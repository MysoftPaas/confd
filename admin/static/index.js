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
                    utils.get(config.apiHost + '/api/projects', function(response) {
                        if (response.data.result === false) {
                            ui.alert('出错', response.data.msg, 'error')
                        }
                        self.items = response.data;
                    });
                },
                selectProject: function(proj) {
                    var self = this;
                    self.currentProject.project = proj
                    utils.get(config.apiHost + '/api/project/' + proj.Name, function(response) {
                            self.currentProject.resources = response.data.resources;
                    });
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
