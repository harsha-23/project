(function () {

    app.controller("menuCtrl", function (AclService, $scope, api, $timeout, $cookieStore, $location,CONSTANTS, app) {
        var mnc = this;
        mnc.menus = null;
        $scope.can = AclService.can;
        mnc.isOnline = "OFFLINE";
        mnc.domain=CONSTANTS.domain;
        mnc.getName = function () {
            return mnc.name = app.user !== null ? app.user.identity.name : "";
        }

        mnc.init = function () {
            console.log(app.user);
            $timeout(function () {
                mnc.isOnline = app.user !== null ? app.user.isOnline : app.user;
            }, 2000)

        }

        mnc.init();

        mnc.getMenus = function () {
            let loginToken = $cookieStore.get('crossDomainCookie');
            console.log(loginToken)
            // if(loginToken){
            //     $location.path('/');
            //     return
            // }
            setTimeout(()=>{
                console.log("add")
            },2000)
            if (loginToken) {
                var promise = api.getMenus(loginToken);
                promise.then(function mySucces(r) {                    
                    var menus = [];
                    localStorage.setItem('vendor', r.data.adminUser.vendor);
                  localStorage.setItem('user', JSON.stringify(r.data));




                    if(r.data.isTokenValid == "false"){
                        $cookieStore.remove("medfinauthkey");
                        $cookieStore.remove("medfinidentity");
                        // $cookieStore.remove("medfinperm");
                        localStorage.setItem('medfinperm', null);
                        document.cookie.split(";").forEach(function (c) {
                            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                        });
                        // $location.path('/site/login');
                        // alert("logout");
                    }
                    for (let index = 0; index < r.data.menu.length; index++) {
                        for (let k = 0; k < r.data.menu[index].domains.length; k++) {
                            if (r.data.menu[index].domains[k] == mnc.domain) {
                                menus.push(r.data.menu[index]);
                            }
                        }

                    }
                    
                    for(var i=0;i<menus.length;i++){
                        var json=[]
                        if(menus[i].parentMenuName=='Medfin Util'){
                            var length=menus[i].adminMenuItems.length;
                            var firstRange=length-parseInt(length/2);
                            var secondRange=parseInt(length/2);
                            var temp={adminMenuItems:[]}
                            for(var j=0;j<firstRange;j++){
                                temp.adminMenuItems.push(menus[i].adminMenuItems[j]);
                            }
                            json.push(temp);
                            temp={adminMenuItems:[]}
                            for(var j=firstRange;j<length;j++){
                                temp.adminMenuItems.push(menus[i].adminMenuItems[j]);
                            }
                            json.push(temp);
                            menus[i].columns=json;
                            
                        }
                    }
                    mnc.menus = menus;


                    
                    var user=  localStorage.getItem('user');
                  
                 
                 
  



                    // $location.path('/');
                    console.log(' mnc.menus',  mnc.menus);
                    $scope.newLogin(user)
                   
                });
            }
          
        }

        mnc.getMenus();

       
           
    

        $scope.newLogin = function(info){
           
           
            var user=JSON.parse(info);  
            console.log(user)   
                for(let i=0;i<user.adminUser['roles'].length;i++){                          
                  if(user.adminUser['roles'][i].roleTag=='Super Admin'){
                        $cookieStore.put('superAdmin', true);
                    }
                }
               
                $cookieStore.put('medfinauthkey', user.adminUser.authToken);
                if (user.adminUser.notificationFlag == "1") {
                    $cookieStore.put('showAdmin', true);
                    $location.path('/emi-estimate-filter');
                }

                var role = 'admin';
                var abilities = [];

                $.each(user.permissionGroupList, function (k, v) {
                    if (v.permissionList.length > 0) {
                        $.each(v.permissionList, function (k1, v1) {
                            abilities.push(v1.permissionTag);
                            // abilities.push(v1.permissionId);
                        })
                    }

                });
                


                var aclData = {
                    admin: abilities
                }
                console.log(aclData)
                AclService.setAbilities(aclData);
                console.log(AclService)
                var onlineStatus = user.adminUser.hasOwnProperty("onlineStatus") ? user.adminUser.onlineStatus : "OFFLINE";
                var identity = {
                    id: user.adminUser.userId,
                    authToken: user.adminUser.authToken,
                    isOnline: onlineStatus,
                    identity: {
                        name: user.adminUser.name,
                        email: user.adminUser.email,
                        mobile: user.adminUser.mobile,
                        exotelNumber:user.adminUser.exotelNumber,
                        adminUserId:user.adminUser.userId,
                        doctorUniqueToken: user.adminUser.token == undefined ? "" : user.adminUser.token,
                        role: user.adminUser.roles,
                    },
                }
             
                if (user.adminUser.hasOwnProperty('doctorId') && user.adminUser.doctorId != '') {
                    identity.identity.doctorId = user.adminUser.doctorId;
                }

                app.setIdentity(identity);
                localStorage.setItem('medfinperm', btoa(JSON.stringify(abilities)));


                //$cookieStore.put('medfinperm', btoa(JSON.stringify(abilities)));
                $cookieStore.put('medfinidentity', btoa(JSON.stringify(identity)));
                $cookieStore.put('crossDomainCookie',  user.adminUser.authToken);

                let loginToken = $cookieStore.get('crossDomainCookie');
                console.log(loginToken)
                console.log(role)

                // Attach the member role to the current user
                AclService.attachRole(role);
                // if(loginToken){
                //     $location.path('/');
                //     return
                // }
             
                // for (var i = 0; i < user.adminUser.roles.length; i++) {
                //     if (user.adminUser.roles[i].roleName == 'Doctor') {
                //         $location.path('/appointment/upcoming');
                //         location.reload();
                //         return false;
                //     }
                // }
                
                if(user.adminUser.notificationFlag =="1"||user.adminUser.notificationFlag==1){
                    const beamsClient = new PusherPushNotifications.Client({
                        instanceId: '218ba1e6-0eed-47b7-9d7d-ead116a2eec8',
                      });
                    
                      beamsClient.start()
                      .then(() => beamsClient.addDeviceInterest(user.adminUser.userId.toString()))
                      .then(() => {console.log('Successfully registered and subscribed!');
                    //   location.reload();
                    })
                    //   .catch((e)=>{
                    //       console.log(e);
                    //       $scope.logOutFromAdmin();
                    //       return;
                    //   });
            
                    
                }else{

             
                    // location.reload();
                    //test
                   var url= $location.url()
                   console.log(url)
                   console.log( window.location.pathname)
                   if(url=="/site/login"){
                    $location.path("/insurance-estimate-filter");
                   }
                    

                }




         
        }

        mnc.logOut = function () {
            $cookieStore.remove("medfinauthkey");
            $cookieStore.remove("medfinidentity");
            // $cookieStore.remove("medfinperm");
            localStorage.setItem('medfinperm', null);
            document.cookie.split(";").forEach(function (c) {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
            $location.path('/site/login');
        }

        mnc.toggleStatus = function () {
            var status = (mnc.isOnline == "OFFLINE" ? "ONLINE" : "OFFLINE");
            swal({
                    title: "Do you want to set your status to " + status + "?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonClass: "btn-success",
                    confirmButtonText: "Yes, make it!",
                    cancelButtonClass: "btn-danger",
                    cancelButtonText: "No, cancel please!",
                    closeOnConfirm: false,
                    closeOnCancel: true
                },
                function (isConfirm) {
                    if (isConfirm) {
                        App.blockUI();
                        var promise = api.setUserStatus({
                            status: status
                        });
                        promise.then(function mySucces(r) {
                            App.unblockUI();
                            if (r.data.statusCode == 200) {
                                mnc.isOnline = status;
                                var authIdentity = JSON.parse($cookieStore.get('medfinidentity'));
                                authIdentity.isOnline = status;
                                $cookieStore.put('medfinidentity', JSON.stringify(authIdentity));
                                swal("Success", "Status Changed Successfully!", "success");
                            }
                        });
                    }
                });


        }

    })

})()