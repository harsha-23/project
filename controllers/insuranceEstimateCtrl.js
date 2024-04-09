(function () {

    app.controller("insuranceEstimateCtrl", function ($scope, $routeParams, AclService, app, api, actions) {
        app.setTitle("Insurance Estimate | Medfin Clinic Admin");
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
        $scope.claimType='Reimbursement'
        $scope.cashlessEvents=['Check eligibility','File for pre auth'];
        $scope.reimbursementEvents=['Check eligibility','File for pre auth'];
        // $scope.filter={resetStatus:null,status:null}
        $scope.statusList=[];
        $scope.statusLists=[
            {
                
                "name": "Eligible",
                "parentStatus": "New	Progress"
            },
            {
               
                "name": "Hold",
                "parentStatus": "New	Progress"
            },
            {
                
                "name": "Not Eligible",
                "parentStatus": "New	Progress"
            },
            {
                
                "name": "Eligible",
                "parentStatus": "Progress"
            },
            {
               
                "name": "Hold",
                "parentStatus": "Progress"
            },
            {
                
                "name": "Not Eligible",
                "parentStatus": "Progress"
            },
            {
               
                "name": "PreAuth Requested",
                "parentStatus": "Eligible"
            },
            {
               
                "name": "PreAuth Submitted",
                "parentStatus": "PreAuth Requested"
            },
            {
             
                "name": "PreAuth Approved",
                "parentStatus": "PreAuth Submitted"
            },
            {
             
                "name": "PreAuth Rejected",
                "parentStatus": "PreAuth Submitted"
            },
        ]
        console.log("$scope.isLogin", $scope.isLogin);
        $scope.policyId=""
     
        $scope.openUploadDocumentModal = function () {
            $scope.lsLead = $scope.response.leadId;
            $scope.files = [];
            $scope.images = [];
            $scope.fileType = '';
            $scope.commentsUpload = '';
            $('#uploadDocModal').modal('show');

        };
        $scope.openUplodCommentsModal = function () {
            $('#updateCommentsModal').modal('show');
        };
        $scope.openEligiblityCheckModal = function () {
            $('#openEligibilityCheckModal').modal('show');
        };
        $scope.openPreAuthSubmitModal = function () {
            $('#openPreAuthSubmitModal').modal('show');
        };
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

        $scope.openUploadImageModal = function () {
            $scope.lsLead = $scope.response.leadId;
            $scope.filesSelect = [];
            $scope.filesSelectKYP="";
            $scope.images = [];
            $scope.fileType = '';
            $scope.commentsUpload = '';
            $scope.policySelect=$scope.policyId
            $('#DocumentModal').modal('show');
        };
        $scope.documentTypes = ["Pan", "Aadhar", "Prescription"];

        $scope.documentTypes = api.getDocumentListMaster();
        $scope.documentTypes.then(function mySucces(r) {
            if (r.data.statusCode == 200) {
                $scope.documentTypes = r.data.data;
            }
        });
        $scope.documentStatusList=[]

        $scope.response = { token: "" };
        $scope.isTabVisible = false;
        $scope.getInfoByReferenceNumber = function () {
            App.blockUI({
                boxed: !0,
                zIndex: 20000
            })
            var promise = api.getInfoByReferenceNumber($scope.referenceNumber);

            promise.then(function mySucces(r) {
                App.unblockUI();
                console.log(r.data.data);
                if (r.data.statusCode == 200) {
                    $scope.response = r.data.data;
                    var status={
                        "New":["Progress","Eligible","Hold","Not Eligible"],                        
                        "Progress":["Eligible","Hold","Not Eligible"],                            
                        "Eligible":	["PreAuth Requested "],                            
                        "PreAuth Requested":["PreAuth Submitted"],                            
                        "PreAuth Submitted":["PreAuth Approved","PreAuth Rejected"],                        
                        "Hold":["Progress","Eligible","Not Eligible"],
                        "Not Eligible":["Progress","Eligible","Hold"],
                        "PreAuth Rejected":["PreAuth Requested","PreAuth Submitted","PreAuth Approved"],
                        "PreAuth Approved":[],
                        "On Hold":["Progress","Eligible","Not Eligible"]
                    }
                    
                  if($scope.response.status==$scope.response.status){

                    $scope.statusList=status[$scope.response.status]
                  }

                   
                   
                    for(key in $scope.response.leadInsuranceEligibility){
                        $scope.leadInsuranceEligibility= $scope.response.leadInsuranceEligibility[key]
                    }
                    for(key in $scope.response.preAuthSubmit){
                        $scope.preAuthSubmit= $scope.response.preAuthSubmit[key]
                    }
                   

                    let payload={
                        // "lead":"1674621839524-792548",
                        "lead":$scope.response.leadId,

                        "vendor":$scope.response.vendor
                    }

                    App.blockUI({
                        boxed: !0,
                        zIndex: 20000
                    })
                    var promise = api.documentStatus(payload);
    
                    promise.then(function mySucces(r) {
                        App.unblockUI();
                        console.log(r.data.data);
                        if (r.data.statusCode == 200) {
                            $scope.documentStatusList=r.data.data
                            for(key in $scope.documentStatusList){
                                $scope.policyId= $scope.documentStatusList[key].policyId
                            }
                        } else {
                            swal("Error!", 'Error...!', "error");
                        }
                        $('.modal').modal('hide');
                    });

                    $scope.claimType=r.data.data.hasOwnProperty('claimType') && r.data.data.claimType !=="" && r.data.data.claimType=='Cashless'?'Cashless':'Reimbursement';
                    
                    for (let index = 0; index < $scope.response.info.length; index++) {
                        if ($scope.response.info[index].eligibility != 'Pre Auth Rejected' && $scope.response.info[index].eligibility != 'Pre Auth Approved"') {
                            $scope.response.info[index].eligibility = '';
                        }

                    }
                    if (app.user.identity.userType == "external" && $scope.response.hasOwnProperty('status') && $scope.response.status == 'New') {
                        $scope.isSubmitVisible = false;
                        $scope.isCommentVisible = false;
                        $scope.isProgessVisible = true;
                    } else if (app.user.identity.userType == "external" && $scope.response.hasOwnProperty('status') && $scope.response.status == 'Progress') {
                        $scope.isSubmitVisible = true;
                        $scope.isCommentVisible = true;
                        $scope.isOnHoldVisible=true;

                    } else if (app.user.identity.userType == "external" && $scope.response.hasOwnProperty('status') && $scope.response.status == 'On Hold') {
                        $scope.isSubmitVisible = true;
                        $scope.isCommentVisible = true;
						$scope.isOnHoldVisible=false;
                        
                    } else if (app.user.identity.userType == "internal") {
                        $scope.isSubmitVisible = false;
                        $scope.isCommentVisible = true;
                        $scope.isTabVisible = true;
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
        $scope.removeFile = function (index) {

            $scope.files.splice(index, 1)
            console.log("$scope.files", $scope.files);
        };
        $scope.uploadDocument = function () {
            console.log("$scope.myFile ->" + $scope.files.length);

            if ($('#uploadDocForm').valid()) {

                var payload = {
                    "lead": $scope.response.leadId,
					"token":$scope.response.token,
                    "postedBy": app.user.identity.email,
                    "documents": $scope.files,
                    "event": $scope.event,
                    "status":$scope.resetStatus,
                    "message": {
                        "message": $scope.docComments
                    },                   
                }
                console.log('payload', payload);

                App.blockUI({
                    boxed: !0,
                    zIndex: 20000
                })
                var promise = api.uploadLeadDocument(payload);

                promise.then(function mySucces(r) {
                    App.unblockUI();
                    console.log(r.data.data);
                    if (r.data.statusCode == 200) {
                        swal("Success", 'Document Updated Successfully...!', "success");
                        location.reload(true)
                    } else {
                        swal("Error!", 'Error...!', "error");
                    }
                    $('.modal').modal('hide');
                });

            }
        };
        $scope.updateComments = function () {
            if ($('#updateCommentsForm').valid()) {

                var payload = {
                    "lead": $scope.response.leadId,
					"token":$scope.response.token,
                    "postedBy": app.user.identity.email,
                    "event": $scope.cevent,
                    "status":$scope.status,
                    "message": {
                        "message": $scope.commentsUpload
                    },
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
                var promise = api.uploadLeadDocument(payload);

                promise.then(function mySucces(r) {
                    App.unblockUI();
                    console.log(r.data.data);
                    if (r.data.statusCode == 200) {
                        swal("Success", 'Comment Updated Successfully...!', "success");
                        location.reload(true)
                    } else {
                        swal("Error!", 'Error...!', "error");
                    }
                    $.unblockUI();
                    $('.modal').modal('hide');
                });
            }

        };
        $scope.updatePreAuthSubmitted = function () {
            
            if ($('#updatePreAuthSubmittedForm').valid()) {

                var payload = {
                    "lead": $scope.response.leadId,
					"token":$scope.response.token,
                    "postedBy": app.user.identity.email,
                    "event":"PreAuth Submitted",
                    "name":$scope.name,
                    "date":$scope.date,
                    "claimId":$scope.claimId,
                   
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
                var promise = api.updatePreAuthSubmit(payload);

                promise.then(function mySucces(r) {
                    App.unblockUI();
                    console.log(r.data.data);
                    if (r.data.statusCode == 200) {
                        swal("Success", 'Comment Updated Successfully...!', "success");
                        location.reload(true)
                    } else {
                        swal("Error!", r.data.message, "error");
                    }
                    $.unblockUI();
                    $('.modal').modal('hide');
                });
            }

        };
        $scope.updateDocuments = function () {
          
            if ($('#DocumentForm').valid()) {
                console.log("$scope.myFile ->" + $scope.filesSelect.length);
                var payload = {
                    "lead": $scope.response.leadId,
                    // "documentId":$scope.id,
                    "policy": $scope.policySelect,
					"token":$scope.response.token,
                    "postedBy": app.user.identity.email,
                    "url": $scope.filesSelectKYP,
                    "comments":$scope.docComments,
                    "gender":$scope.gender
                   
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
                var promise = api.uploadKYPDocument(payload);

                promise.then(function mySucces(r) {
                    App.unblockUI();
                    console.log(r.data.data);
                    if (r.data.statusCode == 200) {
                        swal("Success", 'document Updated Successfully...!', "success");
                    } else {
                        swal("Error!", 'Error...!', "error");
                    }
                    $.unblockUI();
                    $('.modal').modal('hide');
                });
            }

        };
        $scope.getFiles = function (e) {
            
                formdata = new FormData();
                $scope.$apply(function () {
                    console.log("In Loop>>>>>>>>>>>>>");
                    for (var i = 0; i < e.files.length; i++) {
                        console.log("In Loop>>>>>>>>>>>>> " + e.files[i]);
                        formdata.append("file", e.files[i]);
                    }
                    formdata.append('lead', $scope.response.leadId);
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
                                $scope.filesSelect.push(jsonObj);
                                $scope.filesSelectKYP=jsonObj.url
                            }
                            // swal("Success", 'Document Updated Successfully...!', "success");

                        } else {
                            swal("Error!", 'Error...!', "error");
                        }
                        // $('.modal').modal('hide');
                    });

                });
          

        };
        $scope.removeFile = function (index) {

            $scope.files.splice(index, 1)
            console.log("$scope.files", $scope.files);
        };
        $scope.removeFileDocumentStatus = function (index) {

            $scope.filesSelect.splice(index, 1)
            console.log("$scope.files", $scope.files);
        };
        // $scope.updateDocuments = function () {
        //     console.log("$scope.myFile ->" + $scope.files.length);

        //     if ($('#DocumentForm').valid()) {

        //         var payload = {
        //             "lead": $scope.response.leadId,
		// 			"token":$scope.response.token,
        //             "postedBy": app.user.identity.email,
        //             "documents": $scope.files,
        //             "event": $scope.event,
        //             "status":$scope.resetStatus,
        //             "message": {
        //                 "message": $scope.docComments
        //             },                   
        //         }
        //         console.log('payload', payload);

        //         App.blockUI({
        //             boxed: !0,
        //             zIndex: 20000
        //         })
        //         var promise = api.uploadLeadDocument(payload);

        //         promise.then(function mySucces(r) {
        //             App.unblockUI();
        //             console.log(r.data.data);
        //             if (r.data.statusCode == 200) {
        //                 swal("Success", 'Document Updated Successfully...!', "success");
        //             } else {
        //                 swal("Error!", 'Error...!', "error");
        //             }
        //             $('.modal').modal('hide');
        //         });

        //     }
        // };
        // $scope.createDocuments = function () {
        //     if ($('#DocumentForm').valid()) {

        //         var payload = {
        //             "lead": $scope.response.leadId,
		// 			"token":$scope.response.token,
        //             "postedBy": app.user.identity.email,
        //             "file": $scope.file,
        //             "message": {
        //                 "message": $scope.commentsUpload
        //             },
        //         }
        //         console.log("payload", payload);
        //         App.blockUI({
        //             boxed: !0,
        //             zIndex: 20000
        //         })
        //         $.blockUI({
        //             message: 'Please wait... we are processing your request',
        //             baseZ: 15000
        //         });
        //         var promise = api.uploadLeadDocument(payload);

        //         promise.then(function mySucces(r) {
        //             App.unblockUI();
        //             console.log(r.data.data);
        //             if (r.data.statusCode == 200) {
        //                 swal("Success", 'Comment Updated Successfully...!', "success");
        //             } else {
        //                 swal("Error!", 'Error...!', "error");
        //             }
        //             $.unblockUI();
        //             $('.modal').modal('hide');
        //         });
        //     }

        // };
        $scope.submitEstimatesEligibility = function (req,parentToken) {

        
                var payload = {
                    "token": $scope.response.leadId,
					"parentToken":parentToken,
                    "eligibility": req.eligibility,
                    "postedBy": app.user.identity.email,
                    "copayPercentage": req.copayPercentage,
                    "estimatedFinalApproval": req.estimatedFinalApproval,
                    "implantCovered": req.implantCovered,
                    "initialApproval": req.initialApproval,
                    "laserCovered": req.laserCovered,
                    "nmc": req.nmc,
                    "roomCategory": req.roomCategory,
                    "claimId": req.claimId,
                    "roomRent": req.roomRent,
                    "sumCovered": req.sumCovered,
					"balanceAmount":req.balanceAmount,
                    "comments": req.comments,
                    "surgeryName": req.surgeryName,
                    "surgeryPackage": req.surgeryPackage,
                    "lead": $scope.response.leadId,
                };
                console.log("payload", payload);
                if(req.comments == null || req.comments == undefined || req.comments == ""){
                    swal("Info!", 'Please select  comments...!', "info");
                    return
                }
                App.blockUI({
                    boxed: !0,
                    zIndex: 20000
                })
                $.blockUI({
                    message: 'Please wait... we are processing your request',
                    baseZ: 15000
                });
                var promise = api.submitEstimatesEligible(payload);

                promise.then(function mySucces(r) {
                    App.unblockUI();
                    console.log(r.data.data);
                    if (r.data.statusCode == 200) {

                        swal("Success", 'Information Submit Successfully...!', "success");

                    } else {
                        swal("Error!",r.data.message, "error");
                    }
                    $.unblockUI();
                    $('.modal').modal('hide');
                });
            
        };

        $scope.submitPreAuth = function (req, formId,parentToken) {

            console.log("formId", formId);
            // if ($('#insuranceEstimateForm-' + formId).valid()) {
                
                var payload = {
                    "token": parentToken,
					// "parentToken":parentToken,
                    "name": req.name,
                    "postedBy": app.user.identity.email,                   
                    "date": req.date,
                    "claimId": req.claimId,
                    "event":"PreAuth Submitted",
                    "lead": $scope.response.leadId,
                };
                console.log("payload", payload);
                App.blockUI({
                    boxed: !0,
                    zIndex: 20000
                })
                $.blockUI({
                    message: 'Please wait... we are processing your request',
                    baseZ: 15000
                });
                var promise = api.updatePreAuthSubmit(payload);

                promise.then(function mySucces(r) {
                    App.unblockUI();
                    console.log(r.data.data);
                    if (r.data.statusCode == 200) {

                        swal("Success", 'Information Submit Successfully...!', "success");

                    } else {
                        swal("Error!", 'Error...!', "error");
                    }
                    $.unblockUI();
                    $('.modal').modal('hide');
                });
            
            // }
        };

        $scope.submitEstimates = function (req, formId,parentToken) {

            console.log("formId", formId);
            // if ($('#insuranceEstimateForm-' + formId).valid()) {
                var payload = {
                    "token": req.token,
					"parentToken":parentToken,
                    "eligibility": req.eligibility,
                    "postedBy": app.user.identity.email,
                    "copayPercentage": req.copayPercentage,
                    "estimatedFinalApproval": req.estimatedFinalApproval,
                    "implantCovered": req.implantCovered,
                    "initialApproval": req.initialApproval,
                    "laserCovered": req.laserCovered,
                    "nmc": req.nmc,
                    "roomCategory": req.roomCategory,
                    "claimId": req.claimId,
                    "roomRent": req.roomRent,
                    "sumCovered": req.sumCovered,
					"balanceAmount":req.balanceAmount,
                    "comments": req.comments,
                    "surgeryName": req.surgeryName,
                    "surgeryPackage": req.surgeryPackage,
                    "lead": $scope.response.leadId,
                    "event":"validate"
                };
                console.log("payload", payload);
                App.blockUI({
                    boxed: !0,
                    zIndex: 20000
                })
                $.blockUI({
                    message: 'Please wait... we are processing your request',
                    baseZ: 15000
                });
                var promise = api.submitEstimatesEligiblePreAuthApproved(payload);

                promise.then(function mySucces(r) {
                    App.unblockUI();
                    console.log(r.data.data);
                    if (r.data.statusCode == 200) {

                        swal("Success", 'Information Submit Successfully...!', "success");

                    } else if(r.data.statusCode == 428){
                        var tab = `<div style="display:flex;" >
                        <table border='1'><tr><td>Status- </td><th>PreAuth Approval </th></tr><tr><td>Eligibility- </td><td>${r.data.data.eligibility}</td></tr><tr><td>Surgery Package - </td><td>${r.data.data.surgeryPackage}</td></tr><tr><td>Surgery Name - </td><td>${r.data.data.surgeryName}</td></tr><tr><td>Room Category</td><td>${r.data.data.roomCategory}</td></tr><tr><td>Sum Covered - </td><td>${r.data.data.sumCovered}</td></tr><tr><td>Comments - </td><td>${r.data.data.comments}</td></tr><tr><td>Initial Approval</td><td>${r.data.data.initialApproval}</td></tr><tr><td>Implants Covered - </td><td>${r.data.data.implantCovered}</td></tr><tr><td>Laser Covered - </td><td>${r.data.data.laserCovered}</td></tr><tr><td>Patient - </td><td> ${r.data.data.nmc}</td></tr><tr><td>Claim ID - </td><td> ${r.data.data.claimId}</td></tr><tr><td>Posted By - </td><td> ${r.data.data.postedBy}</td></tr><tr><td>Estimated Final Approval </td><td>${r.data.data.estimatedFinalApproval}</td></tr></table>
                        <table border='1'>
                        <tr>
                      
                        <th> Insurance Estimate Approval</th>
                        </tr>
                        <tr>
                      
                        <td>${r.data.additionalInfo.eligibility?r.data.additionalInfo.eligibility:"-"}</td>
                        </tr>
                        <tr>
                       
                        <td>${r.data.additionalInfo.surgeryPackage?r.data.additionalInfo.surgeryPackage:"-"}</td>
                        </tr>
                        <tr>
                      
                        <td>${r.data.additionalInfo.surgeryName?r.data.additionalInfo.surgeryName:"-"}</td>
                        </tr>
                       
                        <td>${r.data.additionalInfo.roomCategory?r.data.additionalInfo.roomCategory:"-"}</td>
                        </tr>
                        <tr>
                       
                        <td>${r.data.additionalInfo.sumCovered ?r.data.additionalInfo.sumCovered:"-"}</td>
                        </tr>
                        <tr>
                        
                        <td>${r.data.additionalInfo.comments?r.data.additionalInfo.comments:"-"}</td>
                        </tr>
                       
                       
                        <td>${r.data.additionalInfo.initialApproval?r.data.additionalInfo.initialApproval:"-"}</td>
                        </tr>
                        <tr>
                        
                        <td>${r.data.additionalInfo.implantCovered?r.data.additionalInfo.implantCovered:"-"}</td>
                        </tr>
                        <tr>
                        <td>${r.data.additionalInfo.laserCovered?r.data.additionalInfo.laserCovered:"-"}</td>
                        </tr>
                        <tr>
                      
                        <td>${r.data.additionalInfo.nmc?r.data.additionalInfo.nmc:"-"}</td>
                        </tr>
                        <tr>
                      
                        <td>${r.data.additionalInfo.claimId?r.data.additionalInfo.claimId:"-"}</td>
                        </tr>
                        <tr>
                       
                        <td> ${r.data.additionalInfo.postedBy?r.data.additionalInfo.postedBy:"-"}</td>
                        </tr>
                        <tr>
                        
                        <td>${r.data.additionalInfo.estimatedFinalApproval?r.data.additionalInfo.estimatedFinalApproval:"-"}</td>
                        </tr>
                       
                        </table>
                        </div>`;
                        swal({
                                    
                            title: "PreAuth Approval and Insurance Estimate Approval !",
                            html: true,
                            text: tab,  
                            type: "",
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
                                    "token": req.token,
                                    "parentToken":parentToken,
                                    "eligibility": req.eligibility,
                                    "postedBy": app.user.identity.email,
                                    "copayPercentage": req.copayPercentage,
                                    "estimatedFinalApproval": req.estimatedFinalApproval,
                                    "implantCovered": req.implantCovered,
                                    "initialApproval": req.initialApproval,
                                    "laserCovered": req.laserCovered,
                                    "nmc": req.nmc,
                                    "roomCategory": req.roomCategory,
                                    "claimId": req.claimId,
                                    "roomRent": req.roomRent,
                                    "sumCovered": req.sumCovered,
                                    "balanceAmount":req.balanceAmount,
                                    "comments": req.comments,
                                    "surgeryName": req.surgeryName,
                                    "surgeryPackage": req.surgeryPackage,
                                    "lead": $scope.response.leadId,
                                    "event":"confirmation"
                                };
                                console.log("payload", payload);
                                App.blockUI({
                                    boxed: !0,
                                    zIndex: 20000
                                })
                                $.blockUI({
                                    message: 'Please wait... we are processing your request',
                                    baseZ: 15000
                                });
                                var promise = api.submitEstimatesEligiblePreAuthApproved(payload);
                
                                promise.then(function mySucces(r) {
                                    App.unblockUI();
                                    console.log(r.data.data);
                                    if (r.data.statusCode == 200) {
                
                                        swal("Success", 'Information Submit Successfully...!', "success");
                
                                    }else {
                                        swal("Error!",r.data.message, "error");
                                     
                                    }
                                    $.unblockUI();
                                    $('.modal').modal('hide');
                                });
                            }else{
                               // window.location.href='tel:'+toNumber;
                            }
                        });  
                    }else {
                        swal("Error!",r.data.message, "error");
                     
                    }
                    $.unblockUI();
                    $('.modal').modal('hide');
                });
            // }
        };
        $scope.moveToInProgress = function () {
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
                    App.blockUI({boxed: !0, zIndex: 20000})
                    var promise = api.moveToInProgress($scope.referenceNumber);
                    promise.then(function mySuccess(r) {
                        App.unblockUI();
                        if (r.data.statusCode == 200) {
                            location.reload(); 
                        } else {
                            swal("Error!", "error", "error");
                        }
                    });
                }else{
                   // window.location.href='tel:'+toNumber;
                }
            });
        };
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
                    App.blockUI({boxed: !0, zIndex: 20000})
                    var promise = api.moveToOnHold($scope.referenceNumber);
                    promise.then(function mySuccess(r) {
                        App.unblockUI();
                        if (r.data.statusCode == 200) {
                            location.reload(); 
                        } else {
                            swal("Error!", "error", "error");
                        }
                    });
                }else{
                   // window.location.href='tel:'+toNumber;
                }
            });
        }

    });
})();