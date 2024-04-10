(function () {
    app.controller("customerlistCtrl", function (AclService,$scope, $location, $cookies, $cookieStore, app, api) {
       
        $scope.statusList=["Pending","Approved","Rejected"];
        app.setTitle("User List");

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
            // $("#date").datepicker("setDate", new Date());
            // $("#tdate").datepicker("setDate", new Date());

        }, 100);

    })

})();