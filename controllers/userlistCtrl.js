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
            if (r.data.length > 0) {
                $scope.roleList = r.data;
            }

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

        $scope.pagination = function (a, page) {
            var startIndex = ($scope.pageSize * (page - 1));
            $scope.search($scope.keyword, startIndex);
        }

    })

})();