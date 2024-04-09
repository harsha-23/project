var FormWizard = function () {


    return {
        //main function to initiate the module
        init: function () {
            if (!jQuery().bootstrapWizard) {
                return;
            }

            function format(state) {
                if (!state.id) return state.text; // optgroup
                return "<img class='flag' src='../../assets/global/img/flags/" + state.id.toLowerCase() + ".png'/>&nbsp;&nbsp;" + state.text;
            }

            $("#country_list").select2({
                placeholder: "Select",
                allowClear: true,
                formatResult: format,
                width: 'auto', 
                formatSelection: format,
                escapeMarkup: function (m) {
                    return m;
                }
            });

            var form = $('#submit_form');
            var error = $('.alert-danger', form);
            var success = $('.alert-success', form);

            jQuery.validator.addMethod("customEmail", function (value, element) {

                                        // if (isNaN(value)) {
                                        //     console.log('email');
                                        //     return  this.optional(element) || /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value);

                                        // } else {
                                        //     return  this.optional(element) || /^(\d{10})+$/.test(value);
                                        // }

                                        return  this.optional(element) || /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value);

                                    }, "Please enter a valid Email.");

            form.validate({
                doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
                errorElement: 'span', //default input error message container
                errorClass: 'help-block help-block-error', // default input error message class
                focusInvalid: false, 
                // ignore:  ":disabled",//[],// do not focus the last invalid input
                rules: {
                    //account
                    city: {
                        required: true
                    },
                    country: {
                        required: true
                    },
                    cscheduledate:{
                        required: true
                     },
                      cscheduleslot:{
                        required: true
                     },
                    name: {
                        required: true
                    },
                    mobileNumber: {
                        required: true,
                        number:true,
                        maxlength:15,
                        minlength:8
                    },
                    email: {
                        customEmail:true
                    },
                    //profile
                    doctors: {
                        required: true
                    },
                    slot: {
                        required: true
                    },
                     sessionMode:{
                        required: true
                     },
                     bankId:{                         
                        required:function(){
                            if($('#payment').val()=='CHEQUE'){
                                return true;
                            }else{
                                return false;
                            }
                        }
                     },
                    chequeNumberId:{                         
                        required:function(){
                            if($('#payment').val()=='CHEQUE'){
                                return true;
                            }else{
                                return false;
                            }
                        }
                     },

                    

                    // affiliateName: {
                    //     required: true
                    // },
                    // sourceBooking: {
                    //     required: true
                    // },
                    // hearAboutUs: {
                    //     required: true
                    // },
                    // comments: {
                    //     required: true
                    // },
                    // noSessions: {
                    //     required: true
                    // },
                    // 'payment[]': {
                    //     required: true,
                    //     minlength: 1
                    // },
                    // remarks: {
                    //     required: true
                    // },
                    payment: {
                        required: true
                    },
                },

                 messages: { // custom messages for radio buttons and checkboxes
                    'mobileNumber': {
                        maxlength: "Please enter number between 8 to 15 character",
                        minlength: "Please enter number between 8 to 15 character"
                    }
                },

                errorPlacement: function (error, element) { // render error placement for each input type
                    if (element.attr("name") == "gender") { // for uniform radio buttons, insert the after the given container
                        error.insertAfter("#form_gender_error");
                    } else if (element.attr("name") == "payment[]") { // for uniform checkboxes, insert the after the given container
                        error.insertAfter("#form_payment_error");
                    } else if(element.attr("name") == "mobileNumber"){
                        error.insertAfter( element.parent() );
                    }else {
                        error.insertAfter(element); // for other inputs, just perform default behavior
                    }
                },

                invalidHandler: function (event, validator) { //display error alert on form submit   
                    success.hide();
                    error.show();
                    App.scrollTo(error, -200);
                },

                highlight: function (element) { // hightlight error inputs
                    $(element)
                        .closest('.form-group').removeClass('has-success').addClass('has-error'); // set error class to the control group
                },

                unhighlight: function (element) { // revert the change done by hightlight
                    $(element)
                        .closest('.form-group').removeClass('has-error'); // set error class to the control group
                },

                success: function (label) {
                    if (label.attr("for") == "gender" || label.attr("for") == "payment[]") { // for checkboxes and radio buttons, no need to show OK icon
                        label
                            .closest('.form-group').removeClass('has-error').addClass('has-success');
                        label.remove(); // remove error label here
                    } else { // display success icon for other inputs
                        label
                            .addClass('valid') // mark the current input as valid and display OK icon
                        .closest('.form-group').removeClass('has-error').addClass('has-success'); // set success class to the control group
                    }
                },

                submitHandler: function (form) {
                    success.show();
                    error.hide();
                    form[0].submit();
                    //add here some ajax code to submit your form or just call form.submit() if you want to submit the form without ajax
                }

            });

            var displayConfirm = function() {
                $('#tab3 .form-control-static', form).each(function(){
                    var input = $('[name="'+$(this).attr("data-display")+'"]', form);
                    if (input.is(":radio")) {
                        input = $('[name="'+$(this).attr("data-display")+'"]:checked', form);
                    }
                    if (input.is(":text") || input.is("textarea")) {
                        $(this).html(input.val());
                    } else if (input.is("select")) {
                        $(this).html(input.find('option:selected').text());
                    } else if (input.is(":radio") && input.is(":checked")) {
                        $(this).html(input.attr("data-title"));
                    } else if ($(this).attr("data-display") == 'payment[]') {
                        var payment = [];
                        $('[name="payment[]"]:checked', form).each(function(){ 
                            payment.push($(this).attr('data-title'));
                        });
                        $(this).html(payment.join("<br>"));
                    }
                });
            }

            var handleTitle = function(tab, navigation, index) {
                var total = navigation.find('li').length;
                var current = index + 1;
                // set wizard title
                $('.step-title', $('#form_wizard_1')).text('Step ' + (index + 1) + ' of ' + total);
                // set done steps
                jQuery('li', $('#form_wizard_1')).removeClass("done");
                var li_list = navigation.find('li');
                for (var i = 0; i < index; i++) {
                    jQuery(li_list[i]).addClass("done");
                }

                if (current == 1) {
                    $('#form_wizard_1').find('.button-previous').hide();
                } else {
                    $('#form_wizard_1').find('.button-previous').show();
                }

                if (current >= total) {
                    $('#form_wizard_1').find('.button-next').hide();
                    $('#form_wizard_1').find('.button-submit').show();
                    displayConfirm();
                } else {
                    $('#form_wizard_1').find('.button-next').show();
                    $('#form_wizard_1').find('.button-submit').hide();
                }
                App.scrollTo($('.page-title'));
            }

            // default form wizard
            $('#form_wizard_1').bootstrapWizard({
                'nextSelector': '.button-next',
                'previousSelector': '.button-previous',
                onTabClick: function (tab, navigation, index, clickedIndex) {
                   
                    if(index==clickedIndex){
                        return false;
                    }  
                    if(!(index>clickedIndex)){  
                        var diff=clickedIndex-index;
                        for(var i=0;i<diff;i++){
                            $('.button-next').trigger('click');
                        }   
                        return false;
                    }else{
                        var diff=index-clickedIndex;
                        for(var i=0;i<diff;i++){
                            $('.button-previous').trigger('click');
                        }                        
                        return false;
                    }         
                },
                onNext: function (tab, navigation, index,clickedIndex) {
                    success.hide();
                    error.hide();

                   //console.log(index);

                    if (!form.valid() || (!$("#mobile").intlTelInput("isValidNumber") && index==1)){
                            check('mobile',true);
                            return false;
                    } 

                  

                    handleTitle(tab, navigation, index);
                },
                onPrevious: function (tab, navigation, index) {
                    success.hide();
                    error.hide();

                    handleTitle(tab, navigation, index);
                },
                onTabShow: function (tab, navigation, index) {
                    var total = navigation.find('li').length;
                    var current = index + 1;
                    var $percent = (current / total) * 100;
                    $('#form_wizard_1').find('.progress-bar').css({
                        width: $percent + '%'
                    });
                }
            });

            $('#form_wizard_1').find('.button-previous').hide();
            $('#form_wizard_1 .button-submit').click(function () {
               
            }).hide();

            //apply validation on select2 dropdown value change, this only needed for chosen dropdown integration.
            $('#country_list', form).change(function () {
                form.validate().element($(this)); //revalidate the chosen dropdown value and show error or success message for the input
            });
        }

    };

}();

jQuery(document).ready(function() {
    FormWizard.init();
});