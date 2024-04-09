(function () {

    app.controller("createLeadFilterCtrl", function ($scope, AclService, app, api) {
        var sdc = this;

        app.setTitle("Lead Filter | Medfin Clinic Admin");
        $scope.can = AclService.can;
        $scope.app = app;
        $scope.leadList = [];
        $scope.userEmailId = app.user.identity.email;
        $scope.total = 0;
        
        $scope.filter = {
            fromDate: null,
            toDate: null,
            name: null,
            mobile: null,
            status: null,
            posted:$scope.userEmailId,
            rowCount: 20,
            rowIndex: 0
        }
        $scope.leadFilterStatus = api.getLeadFilterStatus();
        $scope.leadFilterStatus.then(function mySucces(r) {
            if (r.data.data.length > 0) {
                $scope.leadFilterStatus = r.data.data;
            }
        });

        $scope.pagination = function (a, page) {
            var startIndex = ($scope.filter, rowCount * (page - 1));
            $scope.leadFilter(startIndex);
        }

        $scope.leadFilter = function (startIndex) {

            $scope.leadList = [];

            if (startIndex == 0) {
                $scope.total = 0;
                $scope.filter.rowIndex = 0;
            }
            if ($('#session-filter-form').valid()) {

                console.log($scope.filter);
                App.blockUI({
                    boxed: !0,
                    zIndex: 20000
                });
                $.blockUI({
                    message: 'Please wait... we are processing your request',
                    baseZ: 15000
                });
                var promise = api.getLeadList($scope.filter);
                promise.then(function mySucces(r) {
                    App.unblockUI();
                    if (r.data.statusCode == 200) {

                        $scope.leadList = r.data.data;
                        $scope.total = r.data.count;

                    } else {
                        swal("Info!", r.data.message, "info");
                    }
                    $.unblockUI();
                });
            }

            // }else{
            //     checkForSessionFilter("mobile");
            // }
        };

        $scope.resetFilter = function () {

            $scope.leadList = [];
            $scope.total = 0;
            $scope.filter = {
                fromDate: null,
                toDate: null,
                name: null,
                mobile: null,
                status: null,
                rowCount: 20,
                rowIndex: 0
            }
            $('#session-filter-form').validate().resetForm();
            $('#session-filter-form').find('.has-error').removeClass('has-error');


        };


    });
})();