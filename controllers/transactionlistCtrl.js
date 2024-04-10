(function () {
    app.controller("transactionlistCtrl", function (AclService,$scope, $location, $cookies, $cookieStore, app, api) {

        app.setTitle("Transaction Deatils");
        $scope.statusList=["Pending","Approved","Rejected"];
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