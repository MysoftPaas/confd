(function(exports) {
    'use strict'
    exports.app = function(elId) {
        return new Vue({
            el: '#' + elId,
            data: {
                project: {},
                items: {},
                selectedItem: {
                    key: "",
                    value: ""
                },
                loggingBody: "",
                hidden: false,
            },
            methods: {
                mouseover: function(e) {
                    e.target.parentElement.style.backgroundColor = "#CCE2FF";
                },
                mouseout: function(e) {
                    e.target.parentElement.style.backgroundColor = "#fff";
                },
                search: function() {},
                loadData: function() {
                    var self = this
                    var projectName = utils.getQuery('name');
                    ui.hideLoading();
                    utils.get(config.apiHost + '/api/project/' + projectName, function(response) {
                        console.log(response);
                        self.project = response.data.project;
                    });
                    utils.get(config.apiHost + '/api/project/' + projectName + '/items', function(response) {
                        self.items = response.data;
                    });
                },
                delete: function(key) {
                    self = this;
                    if (!key) {
                        ui.alert('失败', 'key不能为空', 'error');
                        return;
                    }
                    ui.confirm("delete", "delete " + key + "?", function() {

                        var projectName = utils.getQuery('name');
                        var encodedKey = encodeURIComponent(key);
                        utils.delete(config.apiHost + '/api/project/' + projectName + '/item/' + encodedKey, function(response) {

                            if (response.data.result) {
                                self.items[key] = '';
                                ui.alert('成功', "删除成功", 'success');
                            } else {
                                ui.alert('失败', response.data.msg, 'error');
                            }

                        });
                    })
                },
                select: function(key, value) {
                    this.selectedItem.key = key
                    this.selectedItem.value = value
                },
                set: function(item) {
                    self = this;
                    utils.post(config.apiHost + '/api/project/' + self.project.Name + '/items', {
                        "key": item.key,
                        "value": item.value
                    }, function(response) {

                        if (response.data.result) {
                            self.items[item.key] = item.value;
                            ui.alert('成功', '设置成功', 'success');
                        } else {
                            ui.alert('失败', response.data.msg, 'error')
                        }
                    });
                },
                exec: function() {
                    self = this;
                    utils.post(config.apiHost + '/api/exec', {
                        "projectName": self.project.Name,
                    }, function(response) {

                        if (response.data.result) {
                            ui.alert('成功', '执行成功', 'success');
                        } else {
                            ui.alert('失败', response.data.msg, 'error')
                        }
                    });
                },
                hide: function() {
                    self = this;
                    self.hidden = !self.hidden;
                },
                clean: function() {
                    self = this;
                    self.loggingBody = "";
                },
                log: function(message) {
                    this.loggingBody += message + "\n";
                }
            },
            mounted: function() {
                ui.loading()
                console.log('ready ..')
                this.loadData()
            }
        })
    };

})(window)
