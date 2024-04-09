(function () {
    app.controller("customerLoginCtrl", function (AclService,$scope, $location, $cookies, $cookieStore, app, api) {
        var lgc = this;
        lgc.email = null;
        lgc.password = null;
        lgc.resetemail = null;
        lgc.otp = null;
        lgc.token = null;

        app.setTitle("Customer Registration");

        $scope.submit=function(){
    
            var req={
                "firstName":$scope.firstName,
                "middleName":$scope.middleName,
                "lastName":$scope.lastName,
                "accountType":$scope.accountType,
                "email":$scope.email,
                "password":$scope.password,
                "address":$scope.address,
                "addressOne":$scope.addressOne,
                "city":$scope.city,
                "state":$scope.state,
                "zip":$scope.zip
    
            }
            console.log(JSON.stringify(req))
    
        }
     

    })


})();