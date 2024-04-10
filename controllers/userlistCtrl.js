(function () {
    app.controller("userlistCtrl", function (AclService,$scope, $location, $cookies, $cookieStore, app, api) {
        var lgc = this;
        lgc.email = null;
        lgc.password = null;
        lgc.resetemail = null;
        lgc.otp = null;
        lgc.token = null;

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
        
    })

})();