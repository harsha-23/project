(function () {
    app.controller("tasklistCtrl", function (AclService,$scope, $location, $cookies, $cookieStore, app, api) {

        app.setTitle("Task Deatils");

        setTimeout(function () {

            $scope.transactionStatus = api.getTransactionStatusList();
            $scope.transactionStatus.then(function mySucces(r) {
                    $scope.transactionStatus = r.data.data;
            });
            $scope.submit = function () {

                if (!$('#transactionForm').valid()) {
                    return false;
                }
                var request = {
                   "fromDate":$scope.date,
					"toDate":$scope.tdate,
				 	"status":$scope.status,
				   "transactionId":$scope.transactionId
                };
                $.blockUI({
                    message: 'Please wait... we are processing your request',
                    baseZ: 15000
                });
                var promise = api.getTaskList(request);
                promise.then(function mySucces(r) {
                    App.unblockUI();
                    if (r.data.statusCode === 200) {
                        $scope.TransactionList = r.data.data;
                        $scope.total = r.data.count;
    
                    } else {
                        $scope.TransactionList = [];
                        swal("Error!", "No data found..!", "error");
                    }
                    $.unblockUI();
                });
                // }
    
            }
            $('#date,#tdate').datepicker({
                format: "yyyy-mm-dd",
                autoclose: true,
            });
    
        }, 100);
    })

})();