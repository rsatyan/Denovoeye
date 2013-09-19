var CONFIG = require('config');
 
// Create a new REST API client to make authenticated requests against the
// twilio back end
var client = require('twilio')(CONFIG.Twilio.TWILIO_ACCOUNT_SID, CONFIG.Twilio.TWILIO_AUTH_TOKEN);
 
// Pass in parameters to the REST API using an object literal notation. The
// REST client will handle authentication and response serialzation for you.


exports.sendSMS = function(phonenumber,message) {

    client.sendSms({
        to:phonenumber,
        from:CONFIG.Twilio.TWILIO_NUMBER,
        body:message
    }, function(error, message) {
    
    // The HTTP request to Twilio will run asynchronously.  This callback
    // function will be called when a response is received from Twilio
    
    // The "error" variable will contain error information, if any.
    // If the request was successful, this value will be "falsy"
        if (!error) {
        // The second argument to the callback will contain the information
        // sent back by Twilio for the request.  In this case, it is the
        // information about the text messsage you just sent:
            console.log('Success! The SID for this SMS message is:');
            console.log(message.sid);
 
            console.log('Message sent on:');
            console.log(message.dateCreated);
        }
        else {
            console.log('Oops! There was an error.');
        }
    });
};