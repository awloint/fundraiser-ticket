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

        // check to see if the person has already registered
        $.ajax({
            type: 'POST',
            url: 'buy.php',
            data: dataString,
            success: function(result) {
                if(result == "user exists") {
                    swal("Already Paid", "You have already paid for the Fundraiser Ticket.", "info");
                }
            }
        });

    });

});