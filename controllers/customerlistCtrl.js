(function () {
    app.controller("customerlistCtrl", function (AclService,$scope, $location, $cookies, $cookieStore, app, api) {
       
        $scope.statusList=["Pending","Approved","Rejected"];
        app.setTitle("User List");

        $scope.CustomerStatusList = api.getCustomerStatusList();
        $scope.CustomerStatusList.then(function mySucces(r) {
            console.log(r.data)
       
                $scope.CustomerStatusList = r.data.data;
            
        });
        
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