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
                "email":$scope.username,
                "password":$scope.password,
               
            }
            console.log(JSON.stringify(req))
            $.blockUI({
              message: 'Please wait... we are processing your request',
              baseZ: 15000
            }); 
          var promise = api.customerLogin(req);

          promise.then(function mySucces(r) {
          
              // App.unblockUI();
              $.unblockUI();
              //  $scope.postOtpVerification(r);

              //open otp form if creds are fine
              if (r.data.statusCode == 200){
              
              lgc.token= r.data.data;
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

                var request = {
                  "token": lgc.token,
                  "otp": inputValue
              };
              App.blockUI({
                  boxed: !0
              });

              var promise = api.customerLoginWithOtp(request);

              promise.then(function mySucces(r) {
                  App.unblockUI();
                  if (r.data.statusCode == 200) {
                     window.open("/customer-details")
                  } else {
                    swal.showInputError("please enter Valid OTP!");
                  }
              });
               
                // swal("Nice!", "You wrote: " + inputValue, "success");
              });

              } else{
              //wrong password flow
              swal("Error!", r.data.message.messageDesc, "error");
              }
          });
           
        }
     
    }
    })

})();