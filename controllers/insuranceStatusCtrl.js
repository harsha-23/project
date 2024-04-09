(function () {

    app.controller("insuranceStatusCtrl", function ($scope, AclService, app, api, actions) {
        var sdc = this;

        app.setTitle("Insurance status | Medfin Clinic Admin");
        $scope.can = AclService.can;
        $scope.actions = actions;
        $scope.vendorShow = localStorage.getItem('vendor')

        $scope.statusList = ['New', 'Progress', 'Eligible', 'Not Eligible', 'On Hold', 'Pre-auth Filed','Final approval'];
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
        var promise = api.getInsuranceTpaList();
        promise.then(function mySuccess(r) {
            $scope.insuranceList = r.data.data;
            $scope.tpaList = r.data.additionalInfo;
        });
        


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


            // App.blockUI({
            //     boxed: !0,
            //     zIndex: 20000
            // })
            // $.blockUI({
            //     message: 'Please wait... we are processing your request',
            //     baseZ: 15000
            // });
            // var promise = api.getInsuranceStatusList(requestData);
            // promise.then(function mySucces(r) {

            //     App.unblockUI();

            //     if (r.data.statusCode == 200) {
            //         $scope.userList = r.data.data;

            //         $scope.total = r.data.count;
            //         setTimeout(function () {
            //             $('[data-toggle="popover"]').popover({ html: true });
            //         }, 1000);


            //     } else {

            //         swal("Info!", r.data.message, "info");
            //     }
                // $.unblockUI();
            // });

            
            $scope.sessionList=         
                 [
                  {
                   
                    "remarks": "this is comments",
                    "vendor":"Bima Garage",
                    "surgery": "IVF Surgery",
                    "remarks": "Anoop Reddy Testh",
                    "status": "IVF Surgery",
                    "lead": "24348",
                    "leadStatus": "24348",
                    "doctor": "Shashidhar K P",
                    "agent": "Rabban ulla",
                    "lsLead": "8b17ee48-1b4d-4df1-9c3e-d875cb77e5ce",
                    
                    "insurance": "Acko General Insurance Ltd.",
                    "TPA": "Alankit Insurance TPA Limited",
                    
                    "EligibilityReqDate": "2023-02-15 20:00:00",
                    "EligibilityResponseDate": "2023-02-14 10:00:00",
                    "PreAuthReqDate": "2023-02-15",
                    "PreAuthResponseDate": "2023-02-15",
                    "doctor": "Shashidhar K P",
                    "city": "Bangalore",
                    "hospital": "Medray Diagnostic Center"
                    
                   
                  }
                ]
              
              $scope.sessionListHeaders=[
                "Lead ID / Lead Status",
              
                "Eligibility Req. Date / Eligibility Response Date / Pre Auth Req Date /Pre Auth Response Date",
                  "Status",
                "City",
                "Surgery",
                "Doctor / Hospital",
                " Remarks",
                " Vendor",
                " Insurance / TPA"
              ]
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


        setTimeout(function () {


            $('#date,#tdate').datepicker({
                format: "yyyy-mm-dd",
                autoclose: true,
            });
            // $("#date").datepicker("setDate", new Date());
            // $("#tdate").datepicker("setDate", new Date());

        }, 100);



        
        $scope.cityList = [];
        var promise = api.getSearchableCityList();
        promise.then(function mySuccess(r) {
            // if (res.data.statusCode == 403) {
            //     $location.path('/site/login');
            // }
            let res = r.data.data;
            console.log(res)
            // for(let key in res){
            //     console.log(res[key].list)
            //     var data=res[key].list
            //     $scope.cityList=[$scope.serviceList,...data];
            //     console.log($scope.serviceList)
            // }

            let childCity = [];
            let childCityWithParent = []
            let newChildCity = [];


            let cityList = res;
            console.log("list", cityList);

            for (var i = 0; i < cityList.length; i++) {
                if (cityList[i].cities != undefined) {
                    var obj = {
                        id: cityList[i].id,
                        parentCity: cityList[i].name,
                        name: cityList[i].name
                    }
                    // childCity.push(obj);
                    childCityWithParent.push(obj);
                    // var newObjP = { "open": true, text: cityList[i].name, value: cityList[i].name, id: cityList[i].id, children: [] };


                    for (var j = 0; j < cityList[i].cities.length; j++) {
                        cityList[i].cities[j]['parentCity'] = cityList[i].name;
                        childCity.push(cityList[i].cities[j]);
                        childCityWithParent.push(cityList[i].cities[j]);
                        // var newObjC = { text: cityList[i].list[j].name, value: cityList[i].list[j].name, id: cityList[i].list[j].serviceId };
                        // newObjP.children.push(newObjC);
                    }
                    // newChildCity.push(newObjP);
                }

            }

            console.log("childCityWithParent", childCity);
            $scope.cityList = childCity




        });






    });
})();