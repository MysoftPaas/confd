(function(exports) {
    'use strict'
    exports.app = function(elId) {
        return new Vue({
            paths: {
                delete: '/delete',
                set: '/set',
                get: '/get'
            },
            el: '#' + elId,
            data: {
                items: [],
                selectedProject: {
                    name: '',
                    prefix: ''
                },
                selectedItem: {
                    key: '',
                    value: '',
                    project: ''
                }

            },
            methods: {
                delete: function(item) {
                    var self = this;
                    ui.confirm('删除确认', '确定删除['+ item.project +']' + item.key + '?', function() {

                        axios.delete(self.$options.paths.delete + "?project="+item.project+"&key" + item.key).then(function(response) {
                            if (response.data.result) {
                                ui.alert('', '删除成功', 'success');
                                self.items.$remove(item);
                            } else {
                                ui.alert('删除失败', response.data.msg, 'error');
                            }
                        }).catch(function(err) {
                            ui.alert('', '删除出错', 'error');
                            console.log(err);
                        })
                    });
                },
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
                            self.items = response.data.items
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


    exports.ui = {

        confirm: function(title, msg, onApprove) {

            swal({
                title: title,
                text: msg,
                type: "info",
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

})(window)
