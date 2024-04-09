$("#smobileNumber,#mobile,#cmobileNumber,#customerMobile,#fromNumber,#toNumber").intlTelInput({
    initialCountry: "auto",
    geoIpLookup: function(callback) {
		callback("IN");
    },
    placeholderNumberType: "MOBILE",
    // the countries at the top of the list. defaults to united states and united kingdom
    preferredCountries:  ['in', 'id', 'us','sa','sg','my'],
	utilsScript: ""
});

$(document).ready(function(){
    $("#smobileNumber,#mobile,#cmobileNumber,#customerMobile,#fromNumber,#toNumber").attr('type','tel');
    $("#smobileNumber,#mobile,#cmobileNumber,#customerMobile,#fromNumber,#toNumber").attr('maxlength','15');
    $("#smobileNumber,#mobile,#cmobileNumber,#customerMobile,#fromNumber,#toNumber").attr('minlength','8');
    $("#smobileNumber,#mobile,#cmobileNumber,#customerMobile,#fromNumber,#toNumber").attr('onkeypress','return event.charCode >= 48 && event.charCode <= 57')
});