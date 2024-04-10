var app = angular.module("myapp", ["ngRoute", "mm.acl", "ngCookies", "ui.bootstrap", "bw.paging", 's3FileUpload', 'ngSanitize', 'textAngular', 'ui.select', 'ui.toggle']);

// app.factory('middlewareInterceptor', middlewareInterceptor)
//     .config(function ($httpProvider) {
//         $httpProvider.interceptors.push('middlewareInterceptor');
//     });

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.directive('applySwitchForUser', function (api, $location) {
    return function (scope, element, attrs) {
        if (scope.$last) {
            setTimeout(function () {
                $("input[data-toggle='toggle']").bootstrapToggle({
                    on: 'Active',
                    off: 'Inactive',
                    onstyle: 'success',
                    offstyle: 'danger'
                })

                $(".toggle-button").change(function () {
                    var that = this;
                    var userId = $(this).data('uid');
                    var status = $(this).prop('checked');
                    var ustatus = status == true ? '1' : '2';
                    swal({
                        title: "Do you want to change status?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonClass: "btn-success",
                        confirmButtonText: "Yes, change it!",
                        cancelButtonClass: "btn-danger",
                        cancelButtonText: "No, cancel please!",
                        closeOnConfirm: false,
                        closeOnCancel: true
                    },
                        function (isConfirm) {
                            if (isConfirm) {
                                App.blockUI({
                                    boxed: !0
                                });
                                var promise = api.setUserStatus({
                                    id: userId,
                                    status: ustatus
                                });
                                promise.then(function mySucces(r) {
                                    App.unblockUI()
                                    if (r.data.statusCode == 200) {
                                        $(that).prop('checked', status).change();
                                        swal("Success", r.data.message.messageDesc, "success");
                                    } else {
                                        $(that).prop('checked', !status).change();
                                        swal("Error!", r.data.message.messageDesc, "error");
                                    }
                                });
                            } else {
                                $(that).prop('checked', !status).change();
                            }
                        });
                })
            }, 100)
        }
    };
});
app.directive("ngFileSelect", function () {

    return {
        link: function ($scope, el) {

            el.bind("change", function (e) {
                $scope.tempFile = (e.srcElement || e.target).files;
                for (var i = 0; i < $scope.tempFile.length; i++) {
                    $scope.getFileDetails($scope.tempFile[i]);
                }

            })

        }

    }

})

app.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            var keys = Object.keys(props);

            items.forEach(function (item) {
                var itemMatches = false;

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});

app.filter('bytes', function () {
    return function (bytes, precision) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
        if (typeof precision === 'undefined') precision = 1;
        number = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' KB';
    }
});

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
(function () {

    app.constant('SETTINGS', (function () {
        let APIPath="http://65.2.84.156"  
        // if (window.location.href.indexOf("https://vendor.medfin.in") > -1) {
        //    APIPath="https://services.medfin.in"
        //   }else{
        //     APIPath="https://betaservices.medfin.in"
        //   }
    
        return {
            layoutPath: "views/layouts/",
            basePath: "views/layouts/",
            apiBasePath: APIPath,
            JSONFileURL: 'https://medfin-static.s3.amazonaws.com/json-files',
            appId: "4dc2409d737ead4702047ba597c12ea0"

        }
    })());

    app.constant('CONSTANTS', {
        contentType: ['FAQ', 'TESTIMONIALS'],
        domain: "vendor",
        
    });
    app.service('app', function (AclService,$cookieStore) {
        var that = this;
        this.getUserIp = function () {
            return $cookieStore.get('medfinip');
        };
        this.title = null;
        this.doctorList = {};
        this.supervisorList = {};
        this.agentList = {};
        this.serviceList = [];
        this.multiLevelServiceList = [];
        this.childService = [];
        this.hospitalList = {};
        this.setTitle = function (title) {
            this.title = title;
            $("#app-title").text(title);
        };
        this.user = null;

        this.uuidv4 = function () {

            // Format is current time in milliseconds-random nmumber of 10 characters

            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < 10; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            result = new Date().getTime() + result;
            return result;
        }
       
        this.setIdentity = function (identity) {
            this.user = identity;
        }
        this.getAuthToken = function () {
            return (this.user !== null ? this.user.authToken : '');
        }

        this.setDoctorList = function (list) {

            this.doctorList = list;
        }
        this.getDoctorList = function () {

            return this.doctorList;
        }
        this.getHospitalListAPI = function () {

            return this.hospitalList;
        }
        this.getSupervisorList = function () {

            return this.supervisorList;
        }
        this.getAgentList = function () {

            return this.agentList;
        }
        
        this.headers = function () {
            return {
                "x-correlation-id": this.uuidv4(),
                        "x-component": 'ADMIN',
                         "Authorization": "Bearer " + this.getAuthToken(),
                        "Content-Type": "application/json; charset=utf-8",
                        "x-user-email": (this.user != null && this.user != undefined) ? this.user.identity.email : '',
                        "x-token": this.getAuthToken(),
                        "x-ip": this.getUserIp(),
                        "x-user-id": (this.user != null && this.user != undefined) ? this.user.identity.adminUserId : '',
            }
        }
    
        this.clear = function ($event, scope, name, objname) {
            $event.stopPropagation();

            scope[objname][name] = null

            return " ";

        };

    });
    app.factory('middlewareInterceptor', middlewareInterceptor)
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('middlewareInterceptor');
        });
    app.service('actions', function ($http, SETTINGS, app, api, $compile) {
        var that = this;
        this.makeConferenceCall = function (request) {

            var request = {
                "fromNumber": app.user.identity.mobile,
                "toNumber": request.mobile,
                "postedBy": app.user.identity.email,
                "appointmentId": "0",
                "sessionId": "0",
                "event": "Conference"
            };

            swal({
                title: "Do you want to Make a Call?",
                type: "warning",
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
                        App.blockUI({
                            boxed: !0,
                            zIndex: 20000
                        })
                        var promise = api.makeCall(request);
                        promise.then(function mySuccess(r) {
                            App.unblockUI();
                            if (r.data.statusCode == 200) {
                                swal("Success", r.data.message.messageDesc, "success");
                            } else {
                                swal("Error!", r.data.message.messageDesc, "error");
                            }
                        });
                    }
                });

        };
      
        this.getMobileNumber = function (req) {
       
            var request={
                "lead":req.lead,
                "postedBy": app.user.identity.email
      
            }
              
              console.log(request);
              App.blockUI({ boxed: !0, zIndex: 20000 })
              var promise = api.getOTPForMobileNumber(request);
              promise.then(function mySuccess(r) {
                  App.unblockUI();
                  console.log(r)
              })
              swal({
                  title: "Verify OTP!",
                  text: "Please enter the otp sent to  registered mobile number:",
                  type: "input",
                  showCancelButton: true,
                  closeOnConfirm: false,
                  animation: "slide-from-top",
                  inputPlaceholder: "OTP"
                },
                function(inputValue){
                  if(inputValue.length==6){
                      var r={
                       "lead":req.lead,
                       "otp":inputValue
                      }
                      App.blockUI({ boxed: !0, zIndex: 20000 })
                      var promise = api.getVerifyOTPForMobileNumber(r);
                      promise.then(function mySuccess(r) {
                          App.unblockUI();
                          console.log(r)
                          if (r.data.statusCode == 200) {  
                              let msg="Mobile Number is "+r.data.data                                        
                            swal("Success", msg, "success");
                            } else{
                              
                              swal.showInputError(r.data.data);
                              
                          }
                      })
      
                  }else{
                      swal.showInputError("OTP should be 6 character!");
                  }
                  
                });
          };
        this.makeConferenceCallByMobile = function (obj) {

            var request = {
                "fromNumber": app.user.identity.mobile,
                "toNumber": obj.mobile,
                leadId: obj.leadId,
                "postedBy": app.user.identity.email,
                "appointmentId": "0",
                "sessionId": "0",
                "event": "Conference"
            };

            swal({
                title: "Do you want to Make a Call?",
                type: "warning",
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
                        App.blockUI({
                            boxed: !0,
                            zIndex: 20000
                        })
                        var promise = api.makeCall(request);
                        promise.then(function mySuccess(r) {
                            App.unblockUI();
                            if (r.data.statusCode == 200) {
                                swal("Success", r.data.message.messageDesc, "success");
                            } else {
                                swal("Error!", r.data.message.messageDesc, "error");
                            }
                        });
                    }
                });

        }
    });
    app.service('api', function ($http, SETTINGS, app,$cookieStore) {

        var doctorId = '';
        if (app.user != null && app.user.identity.hasOwnProperty('doctorId') && app.user.identity.doctorId != '') {
            doctorId = app.user.identity.doctorId;
        }
        this.getUserIp = function () {
            return $cookieStore.get('medfinip');
        };
        console.log(this.getUserIp+"testing ip");
        this.login = function (request) {
            return $http({
                method: 'POST',
               
                url: SETTINGS.apiBasePath + '/admin/login',
                dataType: 'json',
                data: request,
                headers: {
                    "x-correlation-id": app.uuidv4(),
                    "x-component": 'ADMIN',
                    "x-ip":this.getUserIp(),
                    "Content-Type": "application/json; charset=utf-8",
                    "x-token": app.getAuthToken()

                },
            })
        };
        this.loginWithOtp = function (request) {
            return $http({
                method: 'POST',
                url: SETTINGS.apiBasePath + '/admin/validate-otp',
                dataType: 'json',
                data: request,
                headers: {
                    "x-correlation-id": app.uuidv4(),
                    "x-component": 'ADMIN',
                    "x-ip":this.getUserIp(),
                    "Content-Type": "application/json; charset=utf-8",
                    "x-token": app.getAuthToken()

                },
            })
        };
        this.getRoleList = function () {
            return $http({
                method: 'GET',
                url: SETTINGS.apiBasePath + '/master-info/role-list',
                dataType: 'json',
                headers: app.headers()
            })
        };
        this.getTransactionStatusList = function () {
            return $http({
                method: 'GET',
                url: SETTINGS.apiBasePath + '/master-info/transaction-status-list',
                dataType: 'json',
                headers: app.headers()
            })
        };
        this.getCustomerStatusList = function () {
            return $http({
                method: 'GET',
                url: SETTINGS.apiBasePath + '/master-info/customer-status-list',
                dataType: 'json',
                headers: app.headers()
            })
        };
        
        this.getUsersByKeyword = function (request) {
            return $http({
                method: 'POST',
                url: SETTINGS.apiBasePath + '/admin/filter',
                dataType: 'json',
                data: request,
                headers: {
                    "x-correlation-id": app.uuidv4(),
                    "x-component": 'ADMIN',
                    "x-ip":this.getUserIp(),
                    "Content-Type": "application/json; charset=utf-8",
                    "x-token": app.getAuthToken()

                },
            })
        };
        this.getTransactionList = function (request) {
            return $http({
                method: 'POST',
                url: SETTINGS.apiBasePath + '/transaction/filter',
                dataType: 'json',
                data: request,
                headers: {
                    "x-correlation-id": app.uuidv4(),
                    "x-component": 'ADMIN',
                    "x-ip":this.getUserIp(),
                    "Content-Type": "application/json; charset=utf-8",
                    "x-token": app.getAuthToken()

                },
            })
        };

        getTransactionList
        this.registerUser = function (request) {
            return $http({
                method: 'POST',
                url: SETTINGS.apiBasePath + '/crud/admin-user',
                dataType: 'json',
                data: request,
                headers: {
                    "x-correlation-id": app.uuidv4(),
                    "x-component": 'ADMIN',
                    "x-ip":this.getUserIp(),
                    "Content-Type": "application/json; charset=utf-8",
                    "x-token": app.getAuthToken()

                },
            })
        };
        this.saveCustomer = function (request) {
            return $http({
                method: 'POST',
                url: SETTINGS.apiBasePath + '/crud/customer',
                dataType: 'json',
                data: request,
                headers: {
                    "x-correlation-id": app.uuidv4(),
                    "x-component": 'ADMIN',
                    "x-ip":this.getUserIp(),
                    "Content-Type": "application/json; charset=utf-8",
                    "x-token": app.getAuthToken()

                },
            })
        };   
        this.customerLogin = function (request) {
            return $http({
                method: 'POST',
                url: SETTINGS.apiBasePath + '/customer/login',
                dataType: 'json',
                data: request,
                headers: {
                    "x-correlation-id": app.uuidv4(),
                    "x-component": 'ADMIN',
                    "x-ip":this.getUserIp(),
                    "Content-Type": "application/json; charset=utf-8",
                    "x-token": app.getAuthToken()

                },
            })
        };
        this.customerLoginWithOtp = function (request) {
            return $http({
                method: 'POST',
                url: SETTINGS.apiBasePath + '/customer/validate-otp',
                dataType: 'json',
                data: request,
                headers: {
                    "x-correlation-id": app.uuidv4(),
                    "x-component": 'ADMIN',
                    "x-ip":this.getUserIp(),
                    "Content-Type": "application/json; charset=utf-8",
                    "x-token": app.getAuthToken()

                },
            })
        };
        this.setUserStatusss = function (data) {
            var url = data.uid + '/' + data.status;
            return $http({
                method: 'PUT',
                url: SETTINGS.apiBasePath + '/user/user/' + url,
                dataType: 'json',
                headers: app.headers(),
            })
        };
        this.setUserStatus = function (request) {
            return $http({
                method: 'PUT',
                url: SETTINGS.apiBasePath + '/crud/admin-user-status',
                dataType: 'json',
                data: request,
                headers: {
                    "x-correlation-id": app.uuidv4(),
                    "x-component": 'ADMIN',
                    "x-ip":this.getUserIp(),
                    "Content-Type": "application/json; charset=utf-8",
                    "x-token": app.getAuthToken()
                }
            })
        };
        this.resetPassword = function (request) {
            return $http({
                method: 'PUT',
                url: SETTINGS.apiBasePath + '/user/password',
                dataType: 'json',
                data: request,
                headers: {
                    "x-correlation-id": app.uuidv4(),
                    "x-component": 'ADMIN',
                    "x-ip":this.getUserIp(),
                    "Content-Type": "application/json; charset=utf-8",
                    "x-token": app.getAuthToken()
                }
            })
        };

        this.getLeadFilterStatus = function () {
            return $http({
                method: 'GET',
                url: SETTINGS.apiBasePath + '/user/status-list',

                headers: {
                    "x-correlation-id": app.uuidv4(),
                    "x-component": 'ADMIN',
                    "x-ip":this.getUserIp(),
                    "Content-Type": "application/json; charset=utf-8",
                    "Authorization": "Bearer " + app.getAuthToken(),
                    "x-user-email": app.user.identity.email,
                    "x-token": app.getAuthToken(),
                    "x-user-id": app.user.identity.adminUserId
                },
            })
        };
        
        this.getAccountTypes = function () {
            return $http({
                method: 'GET',
                url: SETTINGS.apiBasePath + '/master-info/account-types',

                headers: {
                    // "x-correlation-id": app.uuidv4(),
                    // "x-component": 'ADMIN',
                    // "x-ip":this.getUserIp(),
                    "Content-Type": "application/json; charset=utf-8",
                    // "Authorization": "Bearer " + app.getAuthToken(),
                    // "x-user-email": app.user.identity.email,
                    // "x-token": app.getAuthToken(),
                    // "x-user-id": app.user.identity.adminUserId
                },
            })
        };

        this.changePassword = function (request) {
            return $http({
                method: 'PUT',
                url: SETTINGS.apiBasePath + '/user/password',
                dataType: 'json',
                data: request,
                headers: app.headers(),
            })
        };
    
        this.getOTPForMobileNumber = function (request) {
            return $http({
                method: 'POST',
                url: SETTINGS.apiBasePath + '/lead/send-otp-view-customer-mobile',
                dataType: 'json',
                data: request,
                headers: {
                    "x-correlation-id": app.uuidv4(),
                    "x-component": 'ADMIN',
                    "x-ip":this.getUserIp(),
                    "Content-Type": "application/json; charset=utf-8",
                    "Authorization": "Bearer " + app.getAuthToken(),
                    "x-user-email": app.user.identity.email,
                    "x-token": app.getAuthToken(),
                    "x-user-id": app.user.identity.adminUserId
                },
            })
        };

        this.getVerifyOTPForMobileNumber = function (request) {
            return $http({
                method: 'POST',
                url: SETTINGS.apiBasePath + '/lead/validate-otp-view-customer-mobile',
                dataType: 'json',
                data: request,
                headers: {
                    "x-correlation-id": app.uuidv4(),
                    "x-component": 'ADMIN',
                    "x-ip":this.getUserIp(),
                    "Content-Type": "application/json; charset=utf-8",
                    "Authorization": "Bearer " + app.getAuthToken(),
                    "x-user-email": app.user.identity.email,
                    "x-token": app.getAuthToken(),
                    "x-user-id": app.user.identity.adminUserId
                },
            })
        };

    })

    /*  define routes for the app */

    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider, $cookieStore, $location) {
        $routeProvider

            .when("/", {
                templateUrl: "views/site/home.html",
                controller: "homeCtrl",
                controllerAs: 'hmc',
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                        return true;
                    }]
                }
            })
            .when("/site/pageNotFound", {
                templateUrl: "views/site/pageNotFound.html",
            })
            .when("/site/unAuthorised", {
                templateUrl: "views/site/unAuthorised.html",
            })
            .when("/site/login", {
                templateUrl: "views/site/login.html",
                controller: "loginCtrl",
                controllerAs: 'lgc',
                resolve: {
                    'acl': ['$q', 'AclService', '$cookieStore', '$location', function ($q, AclService, $cookieStore, $location) {

                        var authKey = $cookieStore.get('medfinauthkey');
                        if (authKey !== undefined) {
                            $location.path('/');
                            return true;
                        }
                    }]
                }
            })
            .when("/account/change-password", {
                templateUrl: "views/account/change-password.html",
                controller: "changePasswordCtrl",
                controllerAs: 'cpc',
                resolve: {
                    'acl': ['$q', 'AclService', '$cookieStore', '$location', function ($q, AclService, $cookieStore, $location) {
                        if (AclService.can('menu.account.change-password')) {

                            return true;
                        } else {
                            return $q.reject('Unauthorized');
                        }
                    }]
                }
            }).when("/user-list", {
                templateUrl: "views/admin/userList.html",
                controller: "userlistCtrl",
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                        // if (AclService.can('menu.insurance-estimate')) {

                        //     return true;
                        // } else {
                        //     return $q.reject('Unauthorized');
                        // }

                    }]
                }
            })
            .when("/customer-list", {
                templateUrl: "views/admin/customerList.html",
                controller: "customerlistCtrl",
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                        // if (AclService.can('menu.insurance-estimate')) {

                        //     return true;
                        // } else {
                        //     return $q.reject('Unauthorized');
                        // }

                    }]
                }
            })

            .when("/transaction-details", {
                templateUrl: "views/admin/transactionList.html",
                controller: "transactionlistCtrl",
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                        // if (AclService.can('menu.insurance-estimate')) {

                        //     return true;
                        // } else {
                        //     return $q.reject('Unauthorized');
                        // }

                    }]
                }
            })

            .when("/insurance-estimate-filter", {
                templateUrl: "views/admin/insuranceEstimateFilter.html",
            controller: "insuranceEstimateFilterCtrl",
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                        // if (AclService.can('menu.insuranace-estimate-filter')) {

                        //     return true;
                        // } else {
                        //     return $q.reject('Unauthorized');
                        // }
                    }]
                }
            })
            .when("/customer-registration", {
                templateUrl: "views/customer/customerRegister.html",
            controller: "customerRegisterCtrl",
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                        // if (AclService.can('menu.insuranace-estimate-filter')) {

                        //     return true;
                        // } else {
                        //     return $q.reject('Unauthorized');
                        // }
                    }]
                }
            })
            .when("/customer-login", {
                templateUrl: "views/customer/customerlogin.html",
            controller: "customerLoginCtrl",
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                        // if (AclService.can('menu.insuranace-estimate-filter')) {

                        //     return true;
                        // } else {
                        //     return $q.reject('Unauthorized');
                        // }
                    }]
                }
            })
            .when("/customer-details", {
                templateUrl: "views/customer/customerDetails.html",
            controller: "customerDetailsCtrl",
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                        // if (AclService.can('menu.insuranace-estimate-filter')) {

                        //     return true;
                        // } else {
                        //     return $q.reject('Unauthorized');
                        // }
                    }]
                }
            })
            .when("/emi-estimate-filter", {
                templateUrl: "views/utilities/EMIEstimateFilter.html",
                controller: "EMIEstimateFilterCtrl",
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {

                        console.log(AclService);
                        if (AclService.can('menu.emi-estimate-filter')) {

                            return true;
                        } else {
                            return $q.reject('Unauthorized');
                        }

                    }]
                }
            })

            .when("/utilities/lead-filter", {
                templateUrl: "views/utilities/createLeadFilter.html",
                controller: "createLeadFilterCtrl",
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                        return true;

                    }]
                }

            }).when('/utilities/create-customer-info', {
                templateUrl: "views/utilities/patientDetail.html",
                controller: "patientDetailCtrl",
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {

                        if (AclService.can('menu.patient.details')) {
                            return true;
                        } else {
                            return $q.reject('Unauthorized');
                        }
                    }]
                }
            }).otherwise({
                templateUrl: "views/site/pageNotFound.html",
            });

        $locationProvider.html5Mode(true);
    }])
        .run(function ($rootScope) {
            $rootScope.$on("$routeChangeSuccess", function () {

                $(".page-mobile-menu").hide();
            })

        });

    app.run(function (AclService, $cookies, $cookieStore, $location, app, api) {
        let userIp = $cookieStore.get('medfinip');
   if(!userIp){
   
       fetch("https://api.ipify.org/?format=json").then(a=>a.json()).then(res=>{
        
        var today = new Date();
        var expiresValue = new Date(today);
    
        //Set 'expires' option in 6 hours
        expiresValue.setMinutes(today.getMinutes() + 360);
           $cookieStore.put('medfinip', res.ip,  {'expires' : expiresValue});
       })
   }
        var getPath = $location.path().split('/');
        var authKey = $cookieStore.get('medfinauthkey');

        if ((getPath[1] == 'lead' && getPath[2] == 'history') || getPath[1] == 'scan-list') {
            // try {

            //     // var visitUrl = $cookieStore.get('visitUrl') == undefined ? undefined : atob($cookieStore.get('visitUrl'));
            //     var role = "admin";
            //     // var authPerm = JSON.parse(atob($cookieStore.get('medfinperm')));
            //     var authPerm = localStorage.getItem('medfinperm') != null ? JSON.parse(atob(localStorage.getItem('medfinperm'))) : '';
            //     var authIdentity = JSON.parse(atob($cookieStore.get('medfinidentity')));

            //     var aclData = {
            //         admin: authPerm
            //     };
            //     console.log('aclData', aclData);
            //     AclService.setAbilities(aclData);

            //     app.setIdentity(authIdentity);

            //     // Attach the member role to the current user
            //     AclService.attachRole(role);
            // } catch (err) {
            //     // $cookieStore.remove('medfinidentity');
            //     // $cookieStore.remove('medfinauthkey');
            //     // $location.path('/site/login');
            //     $location.path($location.path());
            // }

            $location.path($location.path());
        } else if (authKey == undefined) {
            // var path = $location.path();
            // $location.path('/site/login');
            // document.cookie.split(";").forEach(function (c) {
            //     document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            // });
            // if (path != '/site/login') {
            //     $cookieStore.put('visitUrl', btoa(path));
            // }

        } else {
            try {

                var visitUrl = $cookieStore.get('visitUrl') == undefined ? undefined : atob($cookieStore.get('visitUrl'));
                var role = "admin";
                // var authPerm = JSON.parse(atob($cookieStore.get('medfinperm')));
                var authPerm = localStorage.getItem('medfinperm') != null ? JSON.parse(atob(localStorage.getItem('medfinperm'))) : '';
                var authIdentity = JSON.parse(atob($cookieStore.get('medfinidentity')));

                var aclData = {
                    admin: authPerm
                };
                console.log('aclData', aclData);
                AclService.setAbilities(aclData);

                app.setIdentity(authIdentity);

                // Attach the member role to the current user
                AclService.attachRole(role);

                if (visitUrl != undefined || visitUrl != "") {
                    $cookieStore.remove('visitUrl');
                    $location.path(visitUrl);
                }

            } catch (err) {
                $cookieStore.remove('medfinidentity');
                $cookieStore.remove('medfinauthkey');
                $location.path('/site/login');
            }

        }

    });

    app.run(['$rootScope', '$location', function ($rootScope, $location) {

        // If the route change failed due to our "Unauthorized" error, redirect them
        $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {

            if (rejection === 'Unauthorized') {
                $location.path('/site/unAuthorised');
            } else if (rejection === 'LoginRequired') {
                $location.path('/site/login');
            }
        })
    }]);

    angular.module('myapp').directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter, {
                            'event': event
                        });
                    });

                    event.preventDefault();
                }
            });
        };
    });

})();

function middlewareInterceptor() {
    return {
        request: function (config) {
            return config;
        },

        requestError: function (config) {
            return config;
        },

        response: function (res) {
            if (typeof res.data == 'object' && res.data.hasOwnProperty("errorCode")) {
                switch (res.data.flag) {

                    case "LOGIN_PAGE":
                        setTimeout(function () {
                            $(".icon-logout").trigger("click");
                        }, 100);
                        break;
                    case "CHANGE_PASSWORD_PAGE":
                        window.location.href = "/account/change-password";
                        break;
                    default:
                    // code block
                }

            } else if (typeof res.data == 'object' && res.data.hasOwnProperty("statusCode") && res.data.statusCode == 401) {
                swal("Error!", "You are unauthorized user for this request...!", "error");
            } else if (typeof res.data == 'object' && res.data.hasOwnProperty("statusCode") && res.data.statusCode == 403) {
                
                swal("Error!", "Session expired, Please login", "error");
                
                    setTimeout(function () {
                        $(".icon-logout").trigger("click");
                    }, 100);
            
            } else if (typeof res.data == 'object' && res.data.hasOwnProperty("statusCode") && res.data.statusCode == 407) {
                swal("Info!", data.message.messageDesc, "success");
                setTimeout(function () {
                    $(".icon-logout").trigger("click");
                }, 100);
            }
            return res;
        },

        responseError: function (res) {
            App.unblockUI();
            swal("Error!", "Session expired, Please login", "error");
            if(res.statusCode==403){
                setTimeout(function () {
                    $(".icon-logout").trigger("click");
                }, 100);
            }
            return res;
        }
    }
}
