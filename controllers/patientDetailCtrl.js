(function () {

    app.controller("patientDetailCtrl", function ($scope, AclService, app, api) {
        var sdc = this;

        app.setTitle("Patient Information | Medfin Clinic Admin");
        $scope.can = AclService.can;
       
        $scope.userEmailId = app.user.identity.email;
       
	$scope.resetFilter = function () {
        $scope.mobile= '';
        $scope.name='';
       
    };

  
        $scope.submitPatientDetail = function (date,tdate) {
            if (!$('#patientForm').valid()) {
                return false;
            }


            var requestData = {
                 "name": $scope.name,                
                 "mobile":$scope.mobile,  
                 "source":"Admin-Marketing",              
                 "postedBy":app.user.identity.email
            }
            
            App.blockUI({
                boxed: !0,
                zIndex: 20000
            })
            $.blockUI({
                message: 'Please wait... we are processing your request',
                baseZ: 15000
              });
            var promise = api.getPatientList(requestData);
            promise.then(function mySucces(r) {
               
                App.unblockUI();
                if (r.data.statusCode == 200) {

                    swal("Success", "Success", "success");
                    $scope.mobile= '';
                    $scope.name='';
                
                } else {                  
                    swal("Info!", r.data.message, "info");
                }
                $.unblockUI();
            });
        }
    });
})();