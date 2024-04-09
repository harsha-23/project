 
    
       

    function check(obj,checkBlank){

        return true;
        var isValid=$("#"+obj).intlTelInput("isValidNumber");
		var countryData = $("#"+obj).intlTelInput("getSelectedCountryData");
            if(countryData.iso2=='in' && $("#" + obj).val().length==10 && !isNaN($("#"+obj).val())){
                isValid=true;
            }
        console.log(isValid);
        $("#"+obj).parent().parent().parent().removeClass('has-error');
        $('#sessionPhone-error').remove();
        if(!isValid){
            
            var message='This field is required.';
            if(!checkBlank && $("#"+obj).val().trim()==''){
                return false;
            }
            if($("#"+obj).val().trim()!=''){
                var message='Invalid mobile number.';
            }
            $("#"+obj).parent().parent().parent().addClass('has-error');
            $("#"+obj).parent().parent().append("<span id='sessionPhone-error' class='help-block help-block-error'>"+message+"</span>");
                 
        }
        
	
    }
    function checkForCreatelead(obj,checkBlank){        
               
                var isValid=$("#"+obj).intlTelInput("isValidNumber");
				var countryData = $("#"+obj).intlTelInput("getSelectedCountryData");
				if(countryData.iso2=='in' && $("#" + obj).val().length==10 && !isNaN($("#"+obj).val())){
					isValid=true;
				}
                console.log(isValid);
                $("#"+obj).parent().parent().parent().removeClass('has-error');
                $('#sessionPhone-error').remove();
                if(!isValid){
                    
                    var message='This field is required.';
                    if(!checkBlank && $("#"+obj).val().trim()==''){
                        return false;
                    }
                    if($("#"+obj).val().trim()!=''){
                        var message='Invalid mobile number.';
                    }
                    $("#"+obj).parent().parent().parent().addClass('has-error');
                    $("#"+obj).parent().parent().append("<span id='sessionPhone-error' class='help-block help-block-error'>"+message+"</span>");
                         
                }
                
            
        }

    function checkForCustomer(obj){
         return true;
        var isValid=$("#"+obj).intlTelInput("isValidNumber");
        console.log(isValid);
        $("#"+obj).parent().parent().parent().removeClass('has-error');
        $('#sessionPhone-error').remove();
        if(!isValid){
            
            var message='Please fill at least 1 of these fields.';

            if($('#sname').val().trim()!='' || $('#semail').val().trim()!=''){
                return true;
            }
            
            if($("#"+obj).val().trim()!=''){
                var message='Invalid mobile number.';
            }
            $("#"+obj).parent().parent().parent().addClass('has-error');
            $("#"+obj).parent().parent().append("<span id='sessionPhone-error' class='help-block help-block-error'>"+message+"</span>");
                 
        }

        return isValid;
        
	
    }

    function checkForSessionFilter(obj){
         return true;
        var isValid=$("#"+obj).intlTelInput("isValidNumber");
        console.log(isValid);

        

        $("#"+obj).parent().parent().parent().removeClass('has-error');
        $('#sessionPhone-error').remove();
        if(!isValid){
            
            //var message='This field is required.';

            // if($('#startDate').val().trim()!='' || $('#endDate').val().trim()!='' ||
            //  $('#sessionStatus').val().trim()!='' || $('#sessionType').val().trim()!='' ||
            //  $('#status').val().trim()!='' || $('#email').val().trim()!='' || 
            //  $('#customerName').val().trim()!='' || $('#appointmentId').val().trim()!='' ||
            //  $('#doctor').val().trim()!=''){
            //     return true;
            // }
            // $('#session-filter-form').validate().resetForm();
            if($("#"+obj).val().trim()!=''){
                var message='Invalid mobile number.';
            // }else{
            //     // $('#session-filter-form').find('.has-error').removeClass('has-error');
            //     // $('#session-filter-form').find('.help-block').remove();
            // }
                $("#"+obj).parent().parent().parent().addClass('has-error');
                $("#"+obj).parent().parent().append("<span id='sessionPhone-error' class='help-block help-block-error'>"+message+"</span>");
              }   
        }

        return isValid;
        
    
    }

    function checkForClickToCall(obj,index){
        return true;
        var isValid=$("#"+obj).intlTelInput("isValidNumber");
        console.log(isValid);
        $("#"+obj).parent().parent().parent().removeClass('has-error');
        $('#sessionPhone-error-'+index).remove();
        if(!isValid){
            
            var message='This field is required.';
           
            if($("#"+obj).val().trim()!=''){
                var message='Invalid mobile number.';
            }
            $("#"+obj).parent().parent().parent().addClass('has-error');
            $("#"+obj).parent().parent().append("<span id='sessionPhone-error-"+index+"' class='help-block help-block-error'>"+message+"</span>");
                 
        }
        
    
    }

