$(document).ready(function (){
// DOM is fully loaded

    // Capitalize the first letter of First Name
    $('#firstName').on('change', function (e) {
        var $this = $(this),
            val = $this.val();
        regex = /\b[a-z]/g;

        val = val.charAt(0).toUpperCase() + val.substr(1);
    });

    // Capitalize the first letter of Last Name
    $('#lastName').on('change', function (e) {
        var $this = $(this),
            val = $this.val();
        regex = /\b[a-z]/g;

        val = val.charAt(0).toUpperCase() + val.substr(1);
    });

    // change the email to lowercase
    $('#email').on('change', function (e) {
        var $this = $(this),
            val = $this.val();
        val = val.toLowerCase();
    });

    $('form').submit(function(event){
        event.preventDefault();
        
        // Make the submit button load
        $('button').removeClass('btn-danger');
        $('button').toggleClass('btn-primary');
        $('button').html('Loading <span class="spinner"></span><i class="fa fa-spinner fa-spin"></i></span>');

        // put form data into variables
        var firstName = $.trim(document.getElementById('firstName').value);
        var lastName = $.trim(document.getElementById('lastName').value);
        var email = $.trim(document.getElementById('email').value);
        var phone = $.trim(document.getElementById('phone').value);

        var dataString = 'firstName=' + firstName + '&lastName=' + lastName + '&email=' + email + '&phone=' + phone;

        // when payment has been successfully made, this is the dataString to send by POST
        var dataString2 = dataString + '&paid=1'


        // check to see if the person has already registered
        $.ajax({
            type: 'POST',
            url: 'buy.php',
            data: dataString,
            success: function(result) {
                if(result == "user exists") {
                    swal("Already Paid", "You have already paid for the Fundraiser Ticket.", "info");
                    setTimeout(function () {
                        window.location = 'https://awlo.org/'
                    }, 3000);
                } else {
                    // Bring up the Payment Page
                    function payWithPaystack() {
                        var handler = PaystackPop.setup({
                            key: 'pk_live_f6812130fbccdaebe8f96c01101b86fced77d895',
                            email: email,
                            amount: 1000000,
                            firstname: firstName,
                            lastname: lastName,
                            metadata: {
                                custom_fields: [
                                    {
                                        display_name: "Mobile Number",
                                        variable_name: "mobile_number",
                                        value: phone
                                    }
                                ]
                            },
                            callback: function (response) {

                                // console.log(response);
                                // If payment was successful, then post the User Data to the Database and give value
                                if (response.status == 'success') {
                                    $.ajax({
                                        type: 'POST',
                                        url: 'buy.php',
                                        data: dataString2,
                                        success: function (datapost) {

                                        }
                                    });

                                    // Alert the User of a successful registration
                                    swal("Success", "Your ticket purchase was successful and your transaction ref is " + response.reference, "success");
                                    setTimeout(function () {
                                        window.location = 'https://awlo.org'
                                    }, 3000);
                                }

                            },

                        });
                        handler.openIframe();
                    }

                    payWithPaystack();
                }
            }
        });

    });

});