(function () {
    app.controller("customerDetailsCtrl", function (AclService,$scope, $location, $cookies, $cookieStore, app, api) {
        var lgc = this;
        lgc.email = null;
        lgc.password = null;
        lgc.resetemail = null;
        lgc.otp = null;
        lgc.token = null;

        app.setTitle("Customer Details");

        $scope.submit=function(){
    
            var req={
                "username":$scope.username,
                "password":$scope.password,
               
    
            }
            console.log(JSON.stringify(req))
    
        }
     

    })


})();