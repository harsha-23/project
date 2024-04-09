(function () {

    app.controller("insuranceEstimateFilterCtrl", function ($scope, AclService, app, api, actions) {
        var sdc = this;

        app.setTitle("Insurance filter | Medfin Clinic Admin");
        $scope.can = AclService.can;
        $scope.actions = actions;
        $scope.vendorShow = localStorage.getItem('vendor')

        // $scope.statusList = ['New', 'Progress', 'Eligible', 'Not Eligible', 'On Hold', 'Pre-auth Requested','Pre-auth Approval','Pre-auth Rejected','Pre-auth Submitted'];
        $scope.serviceType = '';
        $scope.userEmailId = app.user.identity.email;
        $scope.sessionType = '';
       
        $scope.slotListOfDateAndDate = [];
        $scope.app = app;
        $scope.filter = {
            service: null
        };
        $scope.filter = {
            service: null,
            sdoctor: '',
            shospital: '',

        };
        $scope.status = '';
        $scope.kyp = '';
        $scope.userList = [];

        $scope.service = '';
        $scope.date = '';
        $scope.tdate = '';
        $scope.city = '';
        // $scope.prospect=' ';


        $scope.resetFilter = function () {
            $scope.status = '';
            $scope.date = '';
            $scope.tdate = '';


        };




        $scope.pageSize = 20;
        $scope.total = 0;
        $scope.currentPage = 1;



        $scope.pagination = function (a, page) {
            var startIndex = ($scope.pageSize * (page - 1));
            $scope.submit(startIndex);
        }




        $scope.submit = function (startIndex) {
            // if (!$('#insuranceForm').valid()) {
            //     return false;
            // }
            if (startIndex == 0) {
                $scope.total = 0;
                $scope.currentPage = 1;
            }


            var requestData = {

                "fromDate": $scope.date,
                "toDate": $scope.tdate,
                "status": $scope.status,
                "lead":$scope.lead,
                "name":$scope.name,
                "kypStatus":$scope.kyp,
                "vendor":$scope.vendor,
                "postedBy": app.user.identity.email,
                "rowCount": $scope.pageSize,
                "rowIndex": startIndex,

            }
            console.log('requestData', requestData);


            App.blockUI({
                boxed: !0,
                zIndex: 20000
            })
            $.blockUI({
                message: 'Please wait... we are processing your request',
                baseZ: 15000
            });
            var promise = api.getInsuranceStatusList(requestData);
            promise.then(function mySucces(r) {

                App.unblockUI();

                if (r.data.statusCode == 200) {
                    $scope.userList = r.data.data;

                    $scope.total = r.data.count;
                    setTimeout(function () {
                        $('[data-toggle="popover"]').popover({ html: true });
                    }, 1000);


                } else {

                    swal("Info!", r.data.message, "info");
                }
                $.unblockUI();
            });


        }
        $scope.export = function (startIndex) {
            if (!$('#insuranceForm').valid()) {
                return false;
            }
            if (startIndex == 0) {
                $scope.total = 0;
                $scope.currentPage = 1;
            }


            var requestData = {

                "fromDate": $scope.date,
                "toDate": $scope.tdate,
                "status": $scope.status,
                "postedBy": app.user.identity.email,
                "rowCount": $scope.pageSize,
                "rowIndex": startIndex,
                "exportFlag": "Yes"

            };
            console.log('requestData', requestData);


            App.blockUI({
                boxed: !0,
                zIndex: 20000
            })
            $.blockUI({
                message: 'Please wait... we are processing your request',
                baseZ: 15000
            });
            var promise = api.exportInsuranceStatusList(requestData);
            promise.then(function mySucces(r) {

                App.unblockUI();
                // var a = document.createElement('a');
                // var blob = new Blob([r.data], { type: "application/vnd.ms-excel" });
                // a.href = URL.createObjectURL(blob);
                // var currentDate = new Date();
                // var date = currentDate.getDate();
                // var month = currentDate.getMonth();
                // var year = currentDate.getFullYear();
                // var time = currentDate.toLocaleTimeString(undefined, {
                //     hour: '2-digit',
                //     minute: '2-digit',
                //     second: '2-digit',
                // });
                // var monthDateYearTime = $scope.pad(date) + "-" + $scope.pad(month + 1) + "-" + year + " at " + time;
                // a.download = "report_" + monthDateYearTime;
                // a.click();
                if (r.status == 200) {
                    swal("Success", 'Report has been sent on your Email ID [' + $scope.userEmailId + '] Please check. ', "success");
                } else {
                    swal("Info!", r.data.message, "info");
                }
                $.unblockUI();
            });


        }
        $scope.pad = function (n) {
            return n < 10 ? '0' + n : n;
        }

     
        $scope.kypList=[
            {
                "value":"completed",
                "option":"Approved"
            },
            {
                "value":"",
                "option":"All"
            },
            {
                "value":"pending",
                "option":"Pending"
            },
            {
                "value":"rejected",
                "option":"Rejected"
            },
        ]


        
        var promise = api.getInsuranceVendorList();
        promise.then(function mySucces(r) {

            App.unblockUI();
            if (r.data.statusCode == 200) {
               $scope.vendorList=r.data.data;
              
            } else {
                swal("Info!", r.data.message, "info");
            }
            $.unblockUI();
        });


        var promise = api.getInsuranceStatusListShow();
        promise.then(function mySucces(r) {

            App.unblockUI();
            if (r.data.statusCode == 200) {
               $scope.statusList=r.data.data;
              
            } else {
                swal("Info!", r.data.message, "info");
            }
            $.unblockUI();
        });


        setTimeout(function () {


            $('#date,#tdate').datepicker({
                format: "yyyy-mm-dd",
                autoclose: true,
            });
            // $("#date").datepicker("setDate", new Date());
            // $("#tdate").datepicker("setDate", new Date());

        }, 100);






    });
})();