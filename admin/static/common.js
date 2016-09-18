(function(exports) {
    'use strict'
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
    exports.config = {
        apiHost: 'http://localhost:8000',
    }

})(window)
