(function () {
    app.controller("userlistCtrl", function (AclService,$scope, $location, $cookies, $cookieStore, app, api) {
        $scope.can = AclService.can;
        $scope.userList = [];
        $scope.keyword = '';
        app.setTitle("User List");
      
        $scope.openCreateUserModal = function () {
            $scope.userId = '';
            $scope.email = '';
            $scope.password = '';
            $scope.name = '';
            $scope.allLocations = '';
            $scope.allServices = '';
            $scope.mobile = '';
            $scope.roles = [];

            setTimeout(function () {
                $('.s2m1').select2($scope.roles);
            }, 100);

            $("#mobile").parent().parent().parent().removeClass('has-error');
            $('#sessionPhone-error').remove();
            $('#userModal').modal('show');

        }
        $scope.roleList = api.getRoleList();
        $scope.roleList.then(function mySucces(r) {
            console.log(r.data)
       
                $scope.roleList = r.data.data;
            
        });
        $scope.search = function (keyword, startIndex) {

            // if (startIndex == 0) {
            //     $scope.currentPage = 1;
            // }
            var request = {
                "keyword": keyword
            };

            $.blockUI({
                message: 'Please wait... we are processing your request',
                baseZ: 15000
            });
            var promise = api.getUsersByKeyword(request);
            promise.then(function mySucces(r) {
                App.unblockUI();
                if (r.data.statusCode === 200) {
                    $scope.userList = r.data.data;
                    $scope.total = r.data.count;

                } else {
                    $scope.userList = [];
                    swal("Error!", "No data found..!", "error");
                }
                $.unblockUI();
            });
            // }

        }
        $scope.userId = '';
        $scope.createUser = function () {
         
            if (!$('#createUserForm').valid()) {
                return false;
            }
       
                var requestData = {
                    "email": $scope.email,
                    "name": $scope.name,
                    "password": $scope.password,                 
                    "mobile": $scope.mobile,
                    "altMobile": $scope.altmobile,
                    "roleId": $scope.roles,
                            
                };
                console.log(requestData)
                if ($scope.id != "") {
                    requestData.id = $scope.id;
                }
                App.blockUI({
                    boxed: !0,
                    zIndex: 20000
                });
                var promise = api.registerUser(requestData);

                promise.then(function mySucces(r) {
                    App.unblockUI();
                    if (r.data.statusCode == 200) {
                        $('.modal').modal('hide');
                        swal("Success", r.data.message, "success");
                    } else {
                        swal("Error!", r.data.message, "error");
                    }

                    // $scope.search($scope.keyword, 0);
                });
            
        };
        
        $scope.updateUser = function () {
         
                var requestData = {
                    "id": $scope.userId,
                    "email": $scope.email,
                    "name": $scope.name,
                    "password": $scope.password,                 
                    "mobile": $scope.mobile,
                    "altMobile": $scope.altmobile,
                    "roleId": $scope.roles,
                            
                };
                console.log(requestData)

                App.blockUI({
                    boxed: !0,
                    zIndex: 20000
                });
                var promise = api.updateUser(requestData);

                promise.then(function mySucces(r) {
                    App.unblockUI();
                    if (r.data.statusCode == 200) {
                        $('.modal').modal('hide');
                        swal("Success", r.data.message, "success");
                    } else {
                        swal("Error!", r.data.message, "error");
                    }

                    // $scope.search($scope.keyword, 0);
                });
            
        };
        $scope.getUserById = function (id) {
            $scope.id = '';
            $scope.email = '';
            $scope.password = '';
            $scope.name = '';
            $scope.mobile = '';
            $scope.altmobile = [];

            setTimeout(function () {
                $('.s2m1').select2($scope.roles);
            }, 100);
            App.blockUI({
                boxed: !0
            });
            var promise = api.getUserById(id);
            promise.then(function mySucces(r) {
                App.unblockUI();
                if (r.data.statusCode == 200) {
                    $scope.userId = r.data.info.id;
                    $scope.id = r.data.info.id;
                    $scope.email = r.data.info.email;
                     $scope.password = "";
                    $scope.name = r.data.info.name;
                    $scope.mobile = r.data.info.mobile;
                    $scope.altmobile = r.data.info.altMobile;
                 
                    setTimeout(function () {
                        $('.s2m1').select2($scope.roles);
                    }, 100);
                    $scope.emailExist=$scope.email.length>0?true:false
                    $('#userModal').modal('show');
                } else {
                    swal("Error!", r.data.message.messageDesc, "error");
                }

            });

        };

        $scope.pagination = function (a, page) {
            var startIndex = ($scope.pageSize * (page - 1));
            $scope.search($scope.keyword, startIndex);
        }

    })

})();