(function () {

    app.controller("EMIEstimateFilterCtrl", function ($scope, AclService, app, api, actions) {
        var sdc = this;

        app.setTitle("EMI filter | Medfin Clinic Admin");
        $scope.can = AclService.can;
        $scope.actions = actions;

        // $scope.statusList = ['New','Progress','Approved','Rejected','Accepted by Patient','Rejected by Patient','On Hold','Disbursed'];
        $scope.serviceType = '';
        $scope.userEmailId = app.user.identity.email;
        $scope.sessionType = '';
        $scope.slotListOfDateAndDate = [];
        $scope.app = app;

        $scope.filter = {
            service: null,
            city: null,
            cityClone: null,
            sdoctor: '',
            shospital: '',

        };
        $scope.status = '';
        $scope.userList = [];

        $scope.service = '';
        $scope.date = '';
        $scope.tdate = '';
        $scope.city = '';
        $scope.tokenShared = "";
        $scope.tokenAdded = "";
        $scope.relationList = ["Self", "Spouse", "Parent", "Child", "Son", "Daughter", "Mother", "Father"]

        // $scope.prospect=' ';


        $scope.resetFilter = function () {
            location.reload(true)


        };


        $scope.statusList = []
        $scope.statusTypes = api.getStatusList();
        $scope.statusTypes.then(function mySucces(r) {
            if (r.data.statusCode == 200) {
                $scope.statusList = r.data.data;
            }
        });

        $scope.pageSize = 20;
        $scope.total = 0;
        $scope.currentPage = 1;



        $scope.pagination = function (a, page) {
            var startIndex = ($scope.pageSize * (page - 1));
            $scope.submit(startIndex);
        }


        $scope.export = function (startIndex) {
            // if (!$('#EMIForm').valid()) {
            //     return false;
            // }
            if (startIndex == 0) {
                $scope.total = 0;
                $scope.currentPage = 1;
            }


            var requestData = {
                "lead": $scope.lead,
                "fromDate": $scope.date,
                "toDate": $scope.tdate,
                "name": $scope.patientName,
                "city": $scope.filter.city,
                "mobile": $scope.mobile,
                "vendor": $scope.vendor,
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
            var promise = api.getEMIStatusList(requestData);
            promise.then(function mySucces(r) {

                App.unblockUI();
                if (r.status == 200) {
                    swal("Success", 'Report has been sent on your Email ID [' + $scope.userEmailId + '] Please check. ', "success");
                } else {
                    swal("Info!", r.data.message, "info");
                }
                $.unblockUI();
            });


        }


        $scope.submit = function (startIndex) {
            // if (!$('#EMIForm').valid()) {
            //     return false;
            // }
            if (startIndex == 0) {
                $scope.total = 0;
                $scope.currentPage = 1;
            }




            var requestData = {

                "lead": $scope.lead,
                "fromDate": $scope.date,
                "toDate": $scope.tdate,
                "name": $scope.patientName,
                "city": $scope.filter.city,
                "mobile": $scope.mobile,
                "vendor": $scope.vendor,
                "status": $scope.status,
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
            var promise = api.getEMIStatusList(requestData);
            promise.then(function mySucces(r) {

                App.unblockUI();

                if (r.data.statusCode == 200) {
                    $scope.userList = r.data.data;
                    console.log($scope.userList)
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


        var promise = api.getVendorList();
        promise.then(function mySucces(r) {

            App.unblockUI();
            if (r.data.statusCode == 200) {
                $scope.vendorList = r.data.data;
            } else {
                swal("Info!", r.data.message, "info");
            }
            $.unblockUI();
        });

        $scope.showEMIRulesForClone = function (token) {
            console.log($scope.vendorCloneStatus)

            // $("#showRule").

            var req = {
                "vendor": $scope.vendorCloneStatus,
                "token": $scope.tokenAdded,
                "amount": $scope.surgeryAmount
            }


            var promise = api.getEMIRulesInfo(req);
            promise.then(function mySucces(r) {

                App.unblockUI();
                if (r.data.statusCode == 200) {
                    $scope.data = r.data.data;
                    console.log($scope.data)
                } else {
                    swal("Info!", r.data.message, "info");
                }
                $.unblockUI();
            });

        }

        $scope.showEMIRules = function (token) {
            console.log($scope.vendorStatus)

            // $("#showRule").

            var req = {
                "vendor": $scope.vendorStatus,
                "token": $scope.tokenShared,
                "amount": ""
            }


            var promise = api.getEMIRulesInfo(req);
            promise.then(function mySucces(r) {

                App.unblockUI();
                if (r.data.statusCode == 200) {
                    $scope.data = r.data.data;
                    console.log($scope.data)
                } else {
                    swal("Info!", r.data.message, "info");
                }
                $.unblockUI();
            });

        }

        $scope.showAllEMIRules = function () {

            if ($scope.emiRules.length == 0 || $scope.emiRules == null) {
                $(".showRule").hide();
                return;
            }
            $(".showRule").show();

            $scope.emiData = $scope.data.find(v => v.ruleId == $scope.emiRules)
            console.log($scope.emiData)
            $scope.emi = $scope.emiData.emi;
            $scope.ruleId = $scope.emiData.ruleId;
            $scope.addRuleName = $scope.emiData.ruleName;
            $scope.downPayment = $scope.emiData.downPayment;
            $scope.tenure = $scope.emiData.duration;
            $scope.roi = $scope.emiData.roi;
            $scope.procFee = $scope.emiData.emiProcessing;

        }
        $scope.hideClone = function () {
            $(".showCloneRule").hide();
            $scope.emiRulesClone = ""
            $scope.procFee = ""
        }

        $scope.showAllEMIRulesForClone = function () {
            console.log($scope.emiRulesClone)
            if ($scope.emiRulesClone.length == 0 || $scope.emiRulesClone == null) {
                $(".showCloneRule").hide();
                return;
            }
            $(".showCloneRule").show();

            $scope.emiData = $scope.data.find(v => v.ruleId == $scope.emiRulesClone)
            console.log($scope.emiData)
            $scope.emi = $scope.emiData.emi;
            $scope.ruleId = $scope.emiData.ruleId;
            $scope.downPayment = $scope.emiData.downPayment;
            $scope.tenure = $scope.emiData.duration;
            $scope.roi = $scope.emiData.roi;
            $scope.procFee = $scope.emiData.emiProcessing;

        }
        setTimeout(function () {


            $('#date,#tdate').datepicker({
                format: "yyyy-mm-dd",
                autoclose: true,
            });
            // $("#date").datepicker("setDate", new Date());
            // $("#tdate").datepicker("setDate", new Date());

        }, 100);
        setTimeout(function () {


            $('#surgeryDate').datepicker({
                format: "yyyy-mm-dd",
                autoclose: true,
            });
            // $("#date").datepicker("setDate", new Date());
            // $("#tdate").datepicker("setDate", new Date());

        }, 100);

        $scope.addVendor = function (token) {
            $scope.tokenShared = token;
            $('#AddModal').modal('show');
        }

        $scope.conversation = []

        $scope.cloneVendor = function (token, obj, EMI) {
            $scope.tokenAdded = token;
            $scope.surgeryName = obj.surgeryName
            $scope.surgeryDate = obj.surgeryDate
            $scope.surgeryAmount = obj.surgeryAmount
            $scope.vendorCloneStatus = obj.vendor;
            $scope.leadId = obj.leadId;
            $scope.relationship = EMI.relationship;
            $scope.corporateName = EMI.corporateName;
            $scope.employeeName = EMI.employeeName;
            // $scope.statusList=[]

            var payload = {
                "token": $scope.tokenAdded
            }
            console.log('payload', payload);
            $scope.docData = api.getEMIDocuments(payload);
            $scope.docData.then(function mySucces(r) {
                if (r.data.statusCode == 200) {
                    $scope.docData = r.data.data;
                    console.log($scope.docData)

                    for (let i = 0; i < $scope.docData.length; i++) {
                        $scope.conversation.push({
                            "type": $scope.docData[i].docType,
                            "url": $scope.docData[i].docURL,
                            "uploadedFlag": $scope.docData[i].uploadedFlag
                        });
                    }

                }
            });
            $('#cloneModal').modal('show');
        }

        $scope.submitVendor = function () {
            if (!$('#addVendorForm').valid()) {
                return false;
            }
            var req = {
                "vendor": $scope.vendorStatus,
                "comments": $scope.comments,
                "downPayment": $scope.downPayment,
                "ruleId": $scope.ruleId,
                "ruleName": $scope.addRuleName,
                "emi": $scope.emi,
                "emiProcessing": $scope.procFee,
                "roi": $scope.roi,
                "tenure": $scope.tenure,
                "token": $scope.tokenShared,
                "postedBy": app.user.identity.email,
                

            }
            console.log(req)


            App.blockUI({
                boxed: !0,
                zIndex: 20000
            })
            $.blockUI({
                message: 'Please wait... we are processing your request',
                baseZ: 15000
            });
            var promise = api.getEMIAddStatusList(req);
            promise.then(function mySucces(r) {

                App.unblockUI();
                if (r.status == 200) {
                    swal("Success", 'Successfully Added ', "success");
                    $('.modal').modal('hide');
                } else {
                    swal("Info!", r.data.message, "info");
                }
                $.unblockUI();
            });
        }

        $scope.submitClone = function () {
            if (!$('#cloneVendorForm').valid()) {
                return false;
            }
            var req = {
                "vendor": $scope.vendorCloneStatus,
                "comments": $scope.commentsClone,
                "downPayment": $scope.downPayment,
                "leadId": $scope.leadId,
                "ruleId": $scope.ruleId,
                "emi": $scope.emi,
                "emiProcessing": $scope.procFee,
                "roi": $scope.roi,
                "tenure": $scope.tenure,
                "postedBy": app.user.identity.email,
                "surgeryName": $scope.surgeryName,
                "surgeryDate": $scope.surgeryDate,
                "surgeryAmount": $scope.surgeryAmount,
                "relationship": $scope.relationship,
                "corporateName": $scope.corporateName,
                "employeeName": $scope.employeeName,
                "employeeId": $scope.employeeId,
                "city": $scope.filter.cityClone,
                "conversation":[
                    {
                        "documents":$scope.conversation
                    }
              
                ]

            }
            console.log(JSON.stringify(req))


            App.blockUI({
                boxed: !0,
                zIndex: 20000
            })
            $.blockUI({
                message: 'Please wait... we are processing your request',
                baseZ: 15000
            });
            var promise = api.getEMIAddCloneReq(req);
            promise.then(function mySucces(r) {

                App.unblockUI();
                if (r.data.statusCode == 200) {
                    swal("Success", 'Successfully Clone ', "success");
                    $('.modal').modal('hide');
                } else {
                    swal("Info!", r.data.message, "info");
                }
                $.unblockUI();
            });
        }


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