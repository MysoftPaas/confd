(function(exports) {
    'use strict'
    exports.app = function(elId) {
        return new Vue({
            el: '#' + elId,
            data: {
                project: null,
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
                    axios.all([function() {
                            return axios.get(config.apiHost + '/api/project/' + projectName);
                        }(), function() {
                            return axios.get(config.apiHost + '/api/project/' + projectName + '/items');
                        }()]).then(axios.spread(function(resp1, resp2) {
                            ui.hideLoading();
                            self.project = resp1.data.project;
                            self.items = resp2.data;

                        }))
                        .catch(function(err) {
                            ui.hideLoading()
                            ui.alert('出错', '服务器端错误', 'error')
                            console.log(err)
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
                        axios.delete(config.apiHost + '/api/project/' + projectName + '/item/' + encodedKey)
                            .then(function(response) {
                                if (response.data.result) {
                                    ui.hideLoading();
                                    self.items[key] = '';
                                    ui.alert('成功', "删除成功", 'success');
                                } else {
                                    ui.alert('失败', response.data.msg, 'error');
                                }

                            }).catch(function(err) {
                                ui.hideLoading()
                                ui.alert('出错', '服务器端错误', 'error')
                                console.log(err)
                            });
                    })
                },
                select: function(key, value) {
                    this.selectedItem.key = key
                    this.selectedItem.value = value
                },
                set: function(item) {
                    self = this;
                    axios.post(config.apiHost + '/api/project/' + self.project.Name + '/items', {
                            "key": item.key,
                            "value": item.value
                        })
                        .then(function(response) {
                            if (response.data.result) {
                                self.items[item.key] = item.value;
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
                exec: function() {
                    self = this;
                    axios.post(config.apiHost + '/api/exec', {
                            "projectName": self.project.Name,
                        })
                        .then(function(response) {
                            if (response.data.result) {
                                ui.alert('成功', '执行成功', 'success');
                            } else {
                                ui.alert('失败', response.data.msg, 'error')
                            }

                        })
                        .catch(function(err) {
                            ui.hideLoading()
                            ui.alert('出错', '服务器端错误', 'error')
                            console.log(err)
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
            ready: function() {
                ui.loading()
                console.log('ready ..')
                this.loadData()
            }
        })
    };

})(window)