(function () {
    app.controller("customerRegisterCtrl", function (AclService,$scope, $location, $cookies, $cookieStore, app, api) {
        var lgc = this;
        lgc.email = null;
        lgc.password = null;
        lgc.resetemail = null;
        lgc.otp = null;
        lgc.token = null;
        $scope.accountTypeList=[]

        app.setTitle("Customer Registration");
        var promise = api.getAccountTypes();
        promise.then(function mySucces(r) {
            console.log(r)
            App.unblockUI();
            if (r.data.statusCode == 200) {
               $scope.accountTypeList=r.data.data;
              
            } else {
                swal("Info!", r.data.message, "info");
            }
            $.unblockUI();
        });

        $scope.submit=function(){
            if (!$('#RegisterForm').valid()) {
                return false;
            }
    
            var req={
                "firstName":$scope.firstName,
                "middleName":$scope.middleName,
                "lastName":$scope.lastName,
                "accountType":$scope.accountType,
                "email":$scope.email,
                "password":$scope.password,
                "address":{                    
                "address":$scope.address,
                "addressOne":$scope.addressOne,
                "city":$scope.city,
                "state":$scope.state,
                "zip":$scope.zip    
            }
            }
            console.log(JSON.stringify(req))

            swal("Success!", "User Created Successfully", "success");
            setTimeout(()=>{
            window.open("/customer-login")
        },1500)
            
            // App.blockUI({
            //     boxed: !0,
            //     zIndex: 20000
            // })
            // $.blockUI({
            //     message: 'Please wait... we are processing your request',
            //     baseZ: 15000
            // });
            // var promise = api.getInsuranceStatusList(requestData);
            // promise.then(function mySucces(r) {

            //     App.unblockUI();

            //     if (r.data.statusCode == 200) {
            //         $scope.userList = r.data.data;

            //         $scope.total = r.data.count;
            //         setTimeout(function () {
            //             $('[data-toggle="popover"]').popover({ html: true });
            //         }, 1000);


            //     } else {

            //         swal("Info!", r.data.message, "info");
            //     }
            //     $.unblockUI();
            // });
    
        }
     

    })


})();