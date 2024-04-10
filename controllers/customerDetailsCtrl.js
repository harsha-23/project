(function () {
    app.controller("customerDetailsCtrl", function (AclService,$scope, $location, $cookies, $cookieStore, app, api) {
        
        app.setTitle("Customer Details");

    //   setTimeout(()=>{
        var customer=localStorage.getItem('customerInfo');
     
        $scope.req= JSON.parse(customer)
    
    // })
  
    
       
    $scope.accountTypeList=[]

  
    var promise = api.getAccountTypes();
    promise.then(function mySucces(r) {
        console.log(r)
        App.unblockUI();
        if (r.data.statusCode == 200) {
           $scope.accountTypeList=r.data.data;
          
        } else {
            swal("Info!", r.data.message, "info");
        }
        $.unblockUI();
    });
        $scope.submit=function(){
    
            var req={
                "username":$scope.username,
                "password":$scope.password,
               
    
            }
            console.log(JSON.stringify(req))
    
        }
     

    })


})();