
(function () {

    app.controller("changePasswordCtrl", function (AclService, app, api) {
        var cpc = this;
        app.setTitle("Change password | Medfin Clinic Admin");

        cpc.current_password = null;
        cpc.new_password = null;
        cpc.repeat_password = null;

        cpc.changePassword = function () {
            if ($("#formChangePassword").valid()) {
                var request = {
                    "email": app.user.identity.email,
                    "oldPassword": cpc.current_password,
                    "password": cpc.new_password,
                    "eventType": "change-password"
                };

                App.blockUI({boxed: !0});
                var promise = api.changePassword(request);
                promise.then(function mySucces(r) {
                    App.unblockUI();
                    if (r.data.statusCode == 200) {
                        swal("Done!", r.data.message.messageDesc, "success")
                    } else {
                        swal("Error!", r.data.message.messageDesc, "error")
                    }
                });
            }
        }



    })

})();