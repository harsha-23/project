(function () {
    app.controller("loginCtrl", function (AclService,$scope, $location, $cookies, $cookieStore, app, api) {
        var lgc = this;
        lgc.email = null;
        lgc.password = null;
        lgc.resetemail = null;
        lgc.otp = null;
        lgc.token = null;

        app.setTitle("Login | Medfin Clinic Admin");
       
        $scope.logOutFromAdmin = function () {
            swal({
                title: "error",
                text: "Please allow \n1. Notification \n2. Popups and redirects. \nGo to the following link and follow along the doc to make neccessary changes. \n https://docs.google.com/document/d/12aDI-mVQtAL8LaDkOwvwM_DhZZSzB5qXQlvdA9rMYoQ/edit \n",
                type: "error"
            }, function() {
                location.reload();
            });
            // $cookieStore.remove("medfinauthkey");
            // $cookieStore.remove("medfinidentity");
            // $cookieStore.remove("crossDomainCookie");            
            // $cookieStore.remove("showAdmin");
            // $cookieStore.remove('superAdmin');
			// document.cookie = "crossDomainCookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC;"

            // localStorage.setItem('medfinperm', null);
            // document.cookie.split(";").forEach(function (c) {
            //     document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            // });
            // $location.path('/site/login');
        }

        $scope.postOtpVerification = function(r){
            if (r.data.statusCode == 200) {
                $location.path('/');     
                
                // $cookieStore.put('medfinauthkey', r.data.adminUser.authToken);
                // if (r.data.adminUser.notificationFlag == "1") {
                //     $cookieStore.put('showAdmin', true);
                //     $location.path('/emi-estimate-filter');
                // }

                var role = 'admin';
                var abilities = [];

                // $.each(r.data.permissionGroupList, function (k, v) {
                //     if (v.permissionList.length > 0) {
                //         $.each(v.permissionList, function (k1, v1) {
                //             abilities.push(v1.permissionTag);
                //             // abilities.push(v1.permissionId);
                //         })
                //     }

                // });
                
                // var aclData = {
                //     admin: abilities
                // }
                AclService.setAbilities(aclData);
                var onlineStatus = r.data.adminUser.hasOwnProperty("onlineStatus") ? r.data.adminUser.onlineStatus : "OFFLINE";
                var identity = {
                    id: r.data.adminUser.userId,
                    authToken: r.data.adminUser.authToken,
                    isOnline: onlineStatus,
                    identity: {
                        name: r.data.name,
                        email: r.data.email,
                        mobile: r.data.mobile,
                        adminUserId:r.data.id,
                        role: r.data.roles,
                    },
                }
             
                app.setIdentity(identity);
                localStorage.setItem('medfinperm', btoa(JSON.stringify(abilities)));

                //$cookieStore.put('medfinperm', btoa(JSON.stringify(abilities)));
                $cookieStore.put('medfinidentity', btoa(JSON.stringify(identity)));
                $cookieStore.put('crossDomainCookie',  r.data.adminUser.authToken);

                let loginToken = $cookieStore.get('crossDomainCookie');
                console.log(loginToken)
                  // Attach the member role to the current user
                AclService.attachRole(role);
                // if(loginToken){
                //     $location.path('/');
                //     return
                // }

                // for (var i = 0; i < r.data.adminUser.roles.length; i++) {
                //     if (r.data.adminUser.roles[i].roleName == 'Doctor') {
                //         $location.path('/appointment/upcoming');
                //         location.reload();
                //         return false;
                //     }
                // }
                if(r.data.adminUser.notificationFlag =="1"||r.data.adminUser.notificationFlag==1){
                    const beamsClient = new PusherPushNotifications.Client({
                        instanceId: '218ba1e6-0eed-47b7-9d7d-ead116a2eec8',
                      });
                    
                      beamsClient.start()
                      .then(() => beamsClient.addDeviceInterest(r.data.adminUser.userId.toString()))
                      .then(() => {console.log('Successfully registered and subscribed!');
                      location.reload();})
                      .catch((e)=>{
                          console.log(e);
                          $scope.logOutFromAdmin();
                          return;
                      });
            
                }else{

                    location.reload();
                }

            } else {
                swal("Error!", r.data.message.messageDesc, "error");
            }
        }
        lgc.login = function ($event) {
            let userIp = $cookieStore.get('medfinip');
            if(!userIp){
            
                fetch("https://api.ipify.org/?format=json").then(a=>a.json()).then(res=>{
                 
                 var today = new Date();
                 var expiresValue = new Date(today);
             
                 //Set 'expires' option in 6 hours
                 expiresValue.setMinutes(today.getMinutes() + 360);
                    $cookieStore.put('medfinip', res.ip,  {'expires' : expiresValue});
                })
            }
            setTimeout(()=>{
            if ($("#login-form").valid()) {
                
                //fetch role/permission from server
                var request = {
                    "email": lgc.email,
                    "password": lgc.password
                };
                // App.blockUI({
                //     boxed: !0
                // });
                $.blockUI({
                    message: 'Please wait... we are processing your request',
                    baseZ: 15000
                  }); 
                var promise = api.login(request);

                promise.then(function mySucces(r) {
                
                    // App.unblockUI();
                    $.unblockUI();
                    //  $scope.postOtpVerification(r);

                    //open otp form if creds are fine
                    if (r.data.statusCode == 200){
                    
                    lgc.token= r.data.data;
                    $("#login-form").hide();
                    $("#otpValidation").show();

                    } else{
                    //wrong password flow
                    swal("Error!", r.data.message.messageDesc, "error");
                    }
                });

            }
        },1000)

        }

        lgc.sendResetPassLink = function () {
            if ($("#resetpasswordform").valid()) {
                var request = {
                    "email": lgc.resetemail,
                    eventType: "reset-password"
                };
                App.blockUI({
                    boxed: !0
                });

                var promise = api.resetPassword(request);

                promise.then(function mySucces(r) {
                    App.unblockUI();
                    if (r.data.statusCode == 200) {
                        swal("Done!", r.data.message.messageDesc, "success");
                        $("#back-btn").trigger('click');
                        $location.path('/site/login');

                    } else {
                        swal("Error!", r.data.message.messageDesc, "error");
                    }
                });
            }
        }

        lgc.validateOtp = function () {
            if ($("#otpValidation").valid()) {
                var request = {
                    "token": lgc.token,
                    "otp": lgc.otp,
                    "email":lgc.email
                };
                App.blockUI({
                    boxed: !0
                });

                var promise = api.loginWithOtp(request);

                promise.then(function mySucces(r) {
                    App.unblockUI();
                    if (r.data.statusCode == 200) {
                       $scope.postOtpVerification(r);

                    } else {
                        swal("Error!", r.data.message.messageDesc, "error");
                    }
                });
            }
        }

    })

})();