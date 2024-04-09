(function () {

    app.controller("EMIEstimateCtrl", function ($scope, $routeParams, AclService, app, api, actions) {
        app.setTitle("EMI Estimate | Medfin Clinic Admin");
        $scope.can = AclService.can;
        $scope.app = app;
        $scope.actions = actions;
        // $scope.userEmailId = app.user.identity.email;
        $scope.referenceNumber = $routeParams.referenceNumber;
        $scope.isLogin = app.user == null ? false : true;
        $scope.isSubmitVisible = true;
        $scope.isProgessVisible = false;
        $scope.isOnHoldVisible = false;
        
        $scope.isCommentVisible = true;
        $scope.isUpdateVisible = false;
        $scope.eventList=["Documents pending","Approved","Rejected"];
        console.log("$scope.isLogin", $scope.isLogin);
        $scope.filter = {
            service:null,
            city:null,
             sdoctor: '',
             shospital: '',
          
         };
        $scope.openUploadDocumentModal = function () {
            $scope.lsLead = $scope.response.leadId;
            $scope.files = [];
            $scope.fileType = '';
            $scope.commentsUpload = '';
            $('#uploadDocModal').modal('show');

        };
        
        $scope.updateStatusApproveReject = function () {
            $('#updateCommentsModalApprove').modal('show');
        };
        $scope.openUplodCommentsModal = function () {
            $('#updateCommentsModal').modal('show');
        };
        $scope.openAddStatusModal = function () {
            $('#addStatusCommentsModal').modal('show');
        };
        $scope.documentTypes = ["Pan", "Aadhar", "Prescription"];

        $scope.documentTypes = api.getDocumentListMaster();
        $scope.documentTypes.then(function mySucces(r) {
            if (r.data.statusCode == 200) {
                $scope.documentTypes = r.data.data;
            }
        });
        $scope.statusList=[]
        $scope.reasonList=["Low monthly income","Over age","Under Age","Scan documents not readable/clear"," ID verification failed","Low CIBIL","Previous loans/due unpaid"]
       

        $scope.response = { token: "" };

        $scope.getInfoByReferenceNumber = function () {
            App.blockUI({
                boxed: !0,
                zIndex: 20000
            })
            var promise = api.getEmiInfoByReferenceNumber($scope.referenceNumber);

            promise.then(function mySucces(r) {
                App.unblockUI();
                console.log(r.data.data);
                if (r.data.statusCode == 200) {
                    $scope.response = r.data.data;
                    $scope.statusList = r.data.additionalInfo;
                    if (app.user.identity.userType == "external" && $scope.response.hasOwnProperty('status') && $scope.response.status == 'New') {
                        $scope.isSubmitVisible = false;
                        $scope.isCommentVisible = false;
                        $scope.isUpdateVisible = false;
                        $scope.isProgessVisible = true;
                     
                    }
                    if ( $scope.response.hasOwnProperty('status') && $scope.response.status == 'Progress') {
                        $scope.isSubmitVisible = true;
                        $scope.isCommentVisible = true;
                        $scope.isUpdateVisible = true;
                        $scope.isOnHoldVisible=true;
                       // $scope.isProgessVisible = true;
           
                       
                     
                    }
                    if (app.user.identity.userType == "external" && $scope.response.hasOwnProperty('status') && $scope.response.status == 'On Hold') {
                        $scope.isSubmitVisible = true;
                        $scope.isCommentVisible = true;
                        $scope.isUpdateVisible = true;
                        $scope.isOnHoldVisible=false;
                       // $scope.isProgessVisible = true;
                       
                     
                    }

                    setTimeout(function () {
                        $('[data-toggle="popover"]').popover({
                            html: true
                        });
                    }, 100);
                } else {
                    $scope.response = {};
                }
            });
        };
        // updateEmi().onclick  = function () {

        //     $('#EmiForm').validate({
                
        // })
        $scope.showEstimate=function(){
          
            $scope.nbfcName=$scope.response.info.nbfcName;
        }
        setTimeout(function(){
           
           
            $('#sanctionDate,#loanDate,#tranferDate').datepicker({
                format: "yyyy-mm-dd",
                autoclose: true,
            });
            $("#sanctionDate").datepicker("setDate", new Date());
            $("#loanDate").datepicker("setDate", new Date());
            // $("#tranferDate").datepicker("setDate", new Date());

            },100);
            // setTimeout(function () {


            //     $('#tranferDate').datepicker({
            //         format: "yyyy-mm-dd",
            //         autoclose: true,
            //     });
            //     // $("#date").datepicker("setDate", new Date());
            //     // $("#tdate").datepicker("setDate", new Date());
    
            // }, 100);
            $scope.rejectUpdateEMI=function(){
               
                var req={
                   
                    "emiToken": $scope.referenceNumber,                  
                    "token": $scope.response.info.token,                   
                    "postedBy": app.user.identity.email,                  
                    "comments": $("#comment12").val(),
                    "status": $("#status").val(),
                   
                }
                console.log('payload', req);
                // console.log(JSON.stringify(req));    
                App.blockUI({
                    boxed: !0,
                    zIndex: 20000
                })
                var promise = api.updateEmiRequest(req);
    
                promise.then(function mySucces(r) {
                    App.unblockUI();
                    if (r.data.statusCode == 200) {
                        swal("Success", r.data.message, "success");
                    } else {
                        swal("Error!", r.data.message, "error");
                    }
                });
    
    
            }
            $(".utr_number").hide();
            $(".tranferDate").hide();
            $(".amount").hide();
            $(".reason").hide();
            $scope.showReason = function () {

                if ($scope.statusSelect == 'Rejected by vendor') {
                    $(".reason").show(); 
                    return;
                }
                $(".reason").hide();
            }
            $scope.showDisbused = function () {

                if ($scope.disbusedType == 'MEDFIN') {
                    $(".tranferDate").show();
                    $(".utr_number").show(); 
                    $(".amount").show();
                    return;
                }
                $(".amount").hide();
                $(".utr_number").hide();
                $(".tranferDate").hide();
            }
        $scope.disbusedSubmit=function(){
            if (!$('#DisbusedForm').valid()) {
                return false;
            }
            var req={
                "disbursementTo": $scope.disbusedType,
                "transferDate":$scope.tranferDate,
                "vendorUTRNumber": $scope.utr_no,
                "medfinUTRNumber": $scope.utr_number_medfin,
                "token": $scope.response.token,
                "amount": $scope.amount,     
                "postedBy": app.user.identity.email,
                "comments": $("#comments").val(),
            }
            console.log('payload', req);
            console.log(JSON.stringify(req)); 
            App.blockUI({
                boxed: !0,
                zIndex: 20000
            })
            
            var promise = api.updateDisbusedRequest(req);

            promise.then(function mySucces(r) {
                App.unblockUI();
                if (r.data.statusCode == 200) {
                    swal("Success", r.data.message, "success");
                } else {
                    swal("Error!", r.data.message, "error");
                }
            });


        }
            $scope.updateEmi=function(){
            if (!$('#EmiFormReq').valid()) {
                return false;
            }
            var req={
                "charges": $("#charges").val(),
                "disbursement": $scope.disbursement,
                "surgeryAmount":$scope.response.info.surgeryAmount,
                "downPayment": $("#downPayment").val(),
                "emiToken": $scope.referenceNumber,
                // "city":$scope.filter.city,
                "token": $scope.response.info.token,
                "downPaymentMonths": $("#downPaymentMonths").val(),
                "emiAmount": $("#emiAmount").val(),
                "emiTenure": $("#emiTenure").val(),
                "loanDate": $scope.loanDate,
                "loanReceipt": $scope.loanReceipt,
                "nbfcName":$("#nbfcName").val(),
                "roi": $("#roi").val(),
                "postedBy": app.user.identity.email,
                "sanctionDate":$scope.sanctionDate,
                "comments": $("#comment12").val(),
                "status": $("#status").val(),
                "sanctionedAmount": $scope.sanctionedAmount,
                "enachSigned":$scope.enachSigned
            }
            console.log('payload', req);
            // console.log(JSON.stringify(req));    
            App.blockUI({
                boxed: !0,
                zIndex: 20000
            })
            var promise = api.updateEmiRequest(req);

            promise.then(function mySucces(r) {
                App.unblockUI();
                if (r.data.statusCode == 200) {
                    swal("Success", r.data.message, "success");
                } else {
                    swal("Error!", r.data.message, "error");
                }
            });


        }
        // $scope.clearData = function () {
        //     $scope.filterSurgeryPrice();
        // };


        $scope.getInfoByReferenceNumber();
        var formdata = new FormData();
        $scope.getFileDetails = function (e) {
            if ($('#uploadDocForm').find('#fileType').valid()) {
                formdata = new FormData();
                $scope.$apply(function () {
                    console.log("In Loop>>>>>>>>>>>>>");
                    for (var i = 0; i < e.files.length; i++) {
                        console.log("In Loop>>>>>>>>>>>>> " + e.files[i]);
                        formdata.append("file", e.files[i]);
                    }
                    formdata.append('lead', $scope.response.leadId);
                    formdata.append('type', $scope.fileType);
                    console.log('formdata', formdata);

                    App.blockUI({
                        boxed: !0,
                        zIndex: 20000
                    })
                    var promise = api.uploadDocumentWithLead(formdata);

                    promise.then(function mySucces(r) {
                        App.unblockUI();
                        console.log(r.data.data);
                        if (r.data.statusCode == 200) {
                            for (var j = 0; j < r.data.data.length; j++) {
                                var jsonObj = { type: $scope.fileType, url: r.data.data[j] };
                                $scope.files.push(jsonObj);
                            }
                            // swal("Success", 'Document Updated Successfully...!', "success");

                        } else {
                            swal("Error!", 'Error...!', "error");
                        }
                        // $('.modal').modal('hide');
                    });

                });
            }

        };

        var promise = api.getVendorList();
        promise.then(function mySucces(r) {

            App.unblockUI();
            if (r.data.statusCode == 200) {
               $scope.vendorList=r.data.data;
              
            } else {
                swal("Info!", r.data.message, "info");
            }
            $.unblockUI();
        });


        $scope.removeFile = function (index) {

            $scope.files.splice(index, 1)
            console.log("$scope.files", $scope.files);
        };
        $scope.uploadDocument = function () {
            console.log("$scope.myFile ->" + $scope.files.length);

            if ($('#uploadDocForm').valid()) {

                var payload = {
                    "token": $scope.response.token,
                    "event":$scope.eventUploadDoc,
                    "postedBy": app.user.identity.email,
                    "documents": $scope.files,
                    "message": {
                        "message": $scope.docComments
                    }
                }
                console.log('payload', payload);

                App.blockUI({
                    boxed: !0,
                    zIndex: 20000
                })
                var promise = api.uploadLeadDocumentEmiFlow(payload);

                promise.then(function mySucces(r) {
                    App.unblockUI();
                    console.log(r.data.data);
                    if (r.data.statusCode == 200) {
                        swal("Success", 'Document Updated Successfully...!', "success");
                    } else {
                        swal("Error!", 'Error...!', "error");
                    }
                    $('.modal').modal('hide');
                });

            }
        };
  

        
        $scope.showDoc = function () {
           

          

                var payload = {
                    "token": $scope.response.leadId,    
                    // "token":"8b17ee48-1b4d-4df1-9c3e-d875cb77e5ce",                  
                }
                console.log('payload', payload);

                App.blockUI({
                    boxed: !0,
                    zIndex: 20000
                })
                var promise = api.getEMIDocuments(payload);

                promise.then(function mySucces(r) {
                    App.unblockUI();
                    console.log(r.data.data);
                    if (r.data.statusCode == 200) {
                        $scope.EMIEstimateDocument = r.data.data;
                        console.log( $scope.EMIEstimateDocument)
                    } else {
                        swal("Error!", 'Error...!', "error");
                    }
                    $('.modal').modal('hide');
                });

            
        };


    


        $scope.updateCommentsApproval = function () {
            if ($('#updateCommentsStatusForm').valid()) {
                var updateStatus=$("#updateStatus").val();
                var payload = {
                    "token": $scope.response.token,
                    "postedBy": app.user.identity.email,
                    "status":updateStatus,
                    "comments": $scope.commentsUpload
                   
                }
                console.log("payload", payload);
                App.blockUI({
                    boxed: !0,
                    zIndex: 20000
                })
                $.blockUI({
                    message: 'Please wait... we are processing your request',
                    baseZ: 15000
                });
                var promise = api.updateEMIStatusFlow(payload);

                promise.then(function mySucces(r) {
                    App.unblockUI();
                   
                    if (r.data.statusCode == 200) {
                        swal("Success", 'Comment Updated Successfully...!', "success");
                    } else {
                        swal("Error!", 'Error...!', "error");
                    }
                    $.unblockUI();
                    $('.modal').modal('hide');
                });
            }

        };
        $scope.updateAddComments = function () {
            if ($('#addStatusCommentsForm').valid()) {

                var payload = {
                    "token": $scope.response.token,                   
                    "status":$scope.statusSelect,
                    "reason":$scope.reasonSelect,
                    "postedBy": app.user.identity.email,
                    "message": {
                        "message": $scope.commentsStatus
                    }
                }
                console.log("payload", payload);
                App.blockUI({
                    boxed: !0,
                    zIndex: 20000
                })
                $.blockUI({
                    message: 'Please wait... we are processing your request',
                    baseZ: 15000
                });
                var promise = api.uploadLeadDocumentEmiFlow(payload);

                promise.then(function mySucces(r) {
                    App.unblockUI();
                    console.log(r.data.data);
                    if (r.data.statusCode == 200) {
                        swal("Success", 'Status Updated Successfully...!', "success");
                    } else {
                        swal("Error!", 'Error...!', "error");
                    }
                    $.unblockUI();
                    $('.modal').modal('hide');
                });
            }

        };
        $scope.updateComments = function () {
            if ($('#updateCommentsForm').valid()) {

                var payload = {
                    "token": $scope.response.token,
                    "event":$scope.cevent,
                    "status":$scope.statusSelect,
                    "postedBy": app.user.identity.email,
                    "message": {
                        "message": $scope.commentsUpload
                    }
                }
                console.log("payload", payload);
                App.blockUI({
                    boxed: !0,
                    zIndex: 20000
                })
                $.blockUI({
                    message: 'Please wait... we are processing your request',
                    baseZ: 15000
                });
                var promise = api.uploadLeadDocumentEmiFlow(payload);

                promise.then(function mySucces(r) {
                    App.unblockUI();
                    console.log(r.data.data);
                    if (r.data.statusCode == 200) {
                        swal("Success", 'Comment Updated Successfully...!', "success");
                    } else {
                        swal("Error!", 'Error...!', "error");
                    }
                    $.unblockUI();
                    $('.modal').modal('hide');
                });
            }

        };

        $scope.moveToInProgressEMI = function () {
            swal({
                                    
                title: "Do you want to change status from New to In-Progress?",
                type: "info",
                showCancelButton: true,
                confirmButtonClass: "btn-success",
                confirmButtonText: "Yes, make it!",
                cancelButtonClass: "btn-danger",
                cancelButtonText: "No, cancel please!",
                closeOnConfirm: false,
                closeOnCancel: true
            },
                    
            function (isConfirm) {
                if (isConfirm) {
                var payload = {
                    "token": $scope.response.token,
                    "postedBy": app.user.identity.email,
                    "status":"Progress"
                }
                console.log("payload", payload);
                App.blockUI({
                    boxed: !0,
                    zIndex: 20000
                })
                $.blockUI({
                    message: 'Please wait... we are processing your request',
                    baseZ: 15000
                });
                var promise = api.updateEMIStatusFlow(payload);

                promise.then(function mySucces(r) {
                    App.unblockUI();
                   
                    if (r.data.statusCode == 200) {
                        swal("Success", 'Comment Updated Successfully...!', "success");
                    } else {
                        swal("Error!", 'Error...!', "error");
                    }
                    $.unblockUI();
                    $('.modal').modal('hide');
					location.reload();
                });
				}
            });
        }
        $scope.cityList=[];
        var promise = api.getSearchableCityList();
        promise.then(function mySuccess(r) {
      
          let  res = r.data.data;   
            console.log(res)       
            // for(let key in res){
            //     console.log(res[key].list)
            //     var data=res[key].list
            //     $scope.cityList=[$scope.serviceList,...data];
            //     console.log($scope.serviceList)
            // }

            let childCity=[];
            let childCityWithParent=[]
            let newChildCity=[];
          

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
            $scope.cityList=childCity



    
        });
        $scope.moveToOnHold = function () {
            swal({
                                    
                title: "Do you want to change status to On Hold?",
                type: "info",
                showCancelButton: true,
                confirmButtonClass: "btn-success",
                confirmButtonText: "Yes, make it!",
                cancelButtonClass: "btn-danger",
                cancelButtonText: "No, cancel please!",
                closeOnConfirm: false,
                closeOnCancel: true
            },
                    
            function (isConfirm) {
                if (isConfirm) {
                var payload = {
                    "token": $scope.response.token,
                    "postedBy": app.user.identity.email,
                    "status":"On Hold"
                }
                console.log("payload", payload);
                App.blockUI({
                    boxed: !0,
                    zIndex: 20000
                })
                $.blockUI({
                    message: 'Please wait... we are processing your request',
                    baseZ: 15000
                });
                var promise = api.updateEMIStatusFlow(payload);

                promise.then(function mySucces(r) {
                    App.unblockUI();
                   
                    if (r.data.statusCode == 200) {
                        location.reload(); 
                    } else {
                        swal("Error!", "error", "error");
                    }
                  
                });
				}
            });
        }

    });
})();