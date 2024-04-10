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
            if($scope.username.length>0 && $scope.password.length>0){
    
            var req={
                "username":$scope.username,
                "password":$scope.password,
               
    
            }
            console.log(JSON.stringify(req))
            swal({
                title: "OTP!",
                text: "Please Enter OTP:",
                type: "input",
                // showCancelButton: true,
                closeOnConfirm: false,
                inputPlaceholder: "OTP"
              }, function (inputValue) {
                if (inputValue === false) return false;
                if (inputValue === "") {
                  swal.showInputError("please enter OTP!");
                  return false
                }
                window.open("/customer-details")
                // swal("Nice!", "You wrote: " + inputValue, "success");
              });
        }
     
    }
    })


})();