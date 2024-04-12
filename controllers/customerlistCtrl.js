(function () {
    app.controller("customerlistCtrl", function (AclService,$scope, $location, $cookies, $cookieStore, app, api) {
        app.setTitle("Customer List");
        $scope.userPermissions=localStorage.getItem('permissions');
        $scope.CustomerStatusList = api.getCustomerStatusList();
        $scope.CustomerStatusList.then(function mySucces(r) {
            console.log(r.data)
       
                $scope.CustomerStatusList = r.data.data;
            
        });
        $scope.submit = function () {

            if (!$('#customerForm').valid()) {
                return false;
            }
            var request = {
				"fromDate":$scope.date,
				"toDate":$scope.tdate,
				"email":$scope.email,
				"mobile":$scope.mobile,
				"status":$scope.status
               
            };
            $.blockUI({
                message: 'Please wait... we are processing your request',
                baseZ: 15000
            });
            var promise = api.getCustomerList(request);
            promise.then(function mySucces(r) {
                App.unblockUI();
                if (r.data.statusCode === 200) {
                    $scope.customerList = r.data.data;
                    $scope.total = r.data.count;

                } else {
                    $scope.customerList = [];
                    swal("Error!", "No data found..!", "error");
                }
                $.unblockUI();
            });
            // }

        }
        setTimeout(function () {

            $('#date,#tdate').datepicker({
                format: "yyyy-mm-dd",
                autoclose: true,
            });
            $scope.resetFilter = function () {
                location.reload(true);
            }

        }, 100);

    })

})();