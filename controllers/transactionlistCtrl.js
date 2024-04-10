(function () {
    app.controller("transactionlistCtrl", function (AclService,$scope, $location, $cookies, $cookieStore, app, api) {

        app.setTitle("Transaction Deatils");
        $scope.statusList=["Pending","Approved","Rejected"];
        setTimeout(function () {

            $scope.transactionStatus = api.getTransactionStatusList();
            $scope.transactionStatus.then(function mySucces(r) {
                console.log(r.data)
           
                    $scope.transactionStatus = r.data.data;
                
            });

            $('#date,#tdate').datepicker({
                format: "yyyy-mm-dd",
                autoclose: true,
            });
            // $("#date").datepicker("setDate", new Date());
            // $("#tdate").datepicker("setDate", new Date());

        }, 100);
    })

})();