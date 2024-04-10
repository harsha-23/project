(function () {
    app.controller("customerRegisterCtrl", function (AclService,$scope, $location, $cookies, $cookieStore, app, api) {
        var lgc = this;
        lgc.email = null;
        lgc.password = null;
        lgc.resetemail = null;
        lgc.otp = null;
        lgc.token = null;
        $scope.accountTypeList=[]
        $scope.userTypeList=[]

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
        var promise = api.getUserTypes();
        promise.then(function mySucces(r) {
            console.log(r)
            App.unblockUI();
            if (r.data.statusCode == 200) {
               $scope.userTypeList=r.data.data;
              
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
                "mobile":$scope.mobile,
                "userType":"1",
                "email":$scope.email,
                "password":$scope.password,
                "address":[{                    
                "address1":$scope.address,
                "address2":$scope.addressOne,
                "city":$scope.city,
                "state":$scope.state,
                "zip":$scope.zip    ,
                "addressType":$scope.adressType
            }]
            }
            console.log(JSON.stringify(req))

            App.blockUI({
                boxed: !0,
                zIndex: 20000
            })
            $.blockUI({
                message: 'Please wait... we are processing your request',
                baseZ: 15000
            });
            var promise = api.saveCustomer(req);
            promise.then(function mySucces(r) {

                App.unblockUI();

                if (r.data.statusCode == 200) {

                            swal("Success!", "User Created Successfully", "success");
            setTimeout(()=>{
            window.open("/customer-login")
        },1500)

                } else {

                    swal("Info!", r.data.message, "info");
                }
                $.unblockUI();
            });
    
        }
     
    })

})();