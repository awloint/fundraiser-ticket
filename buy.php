<?php
// Call the database configuration file
require 'dbconfig.php';

// Capture POST Data
$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$email = $_POST['email'];
$phone = $_POST['phone'];

// Open PDO Connection
$dsn = "mysql:host=$host;dbname=$db";

// Create a PDO Connection with the configuration data
$conn = new PDO($dsn, $username, $password);

// check to see if the user is already in database
$usercheck = "SELECT * FROM fundraiser_ticket WHERE email=?";
//Prepare the Query
$usercheckquery = $conn->prepare($usercheck);
//Execute the Query
$usercheckquery->execute(array("$email"));
//Fetch the result
$usercheckquery->rowCount();
if ($usercheckquery->rowCount() > 0) {
    //redirect to the Thank You Page
    echo "user exists";
}

if (isset($_POST['paid']) && $_POST['paid'] == 1) {
    // enter the data into the database
    $enteruser = "INSERT into fundraiser_ticket (firstName, lastName, email, phone) VALUES (:firstName, :lastName, :email, :phone)";
    //Prepare Query
    $enteruserquery = $conn->prepare($enteruser);
    // Execute the Query
    $enteruserquery->execute(
        array(
            "firstName"         =>  $firstName,
            "lastName"          =>  $lastName,
            "email"             =>  $email,
            "phone"             =>  $phone
        )
    );
        
    // Check to see if the query executed successfully
    if ($enteruserquery->rowCount() > 0) {

        //Send SMS
        // prepare the parameters
        $url = 'https://www.bulksmsnigeria.com/api/v1/sms/create';
        $from = 'AWLO';
        $body = "Dear ".$firstName. " " .$lastName. ", you have successfully reserved your spot at the African Women in Leadership Organisation Induction/Fundraising Dinner holding on 17th December 2018 by 5:30pm at D'Podium International Event Centre, 31B Aromire Avenue, Off Adeniyi Jones Avenue, Ikeja. For further enquiries call 08022473972 or send a mail to info@awlo.org.";
        $token = $smstoken;
        $myvars = 'api_token=' . $token . '&from=' . $from . '&to=' . $phone . '&body=' . $body;
        //start CURL
        // create curl resource
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $myvars);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_exec($ch);


    }
}