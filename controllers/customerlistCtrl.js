(function () {
    app.controller("customerlistCtrl", function (AclService,$scope, $location, $cookies, $cookieStore, app, api) {
       
        $scope.status=["Pending","Approved","Rejected"];
        app.setTitle("User List");

    
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