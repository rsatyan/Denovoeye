var nodemailer = require('nodemailer');
var CONFIG = require('config');

var smtpTransport = nodemailer.createTransport(CONFIG.Mailer.TRANSPORT_PROTOCOL,{
    service: CONFIG.Mailer.MAILER_SERVICE,
    auth: {
        user: CONFIG.Mailer.USER,
        pass: CONFIG.Mailer.PASSWORD
    }
});

exports.sendMail = function(user,subject,htmlbody) {

	var mailOptions = 
					{
						from: CONFIG.Mailer.DEFAULT_FROM_ADDRESS, // sender address
			    		to: user.email, // list of receivers	
			    		//to: "sandeepu@qburst.com",		   
						subject:subject,
                		html : htmlbody		    
					}

					// send mail with defined transport object
	smtpTransport.sendMail(mailOptions, function(error, response){
			if(error){
				console.log(error);
			 }else{
			    console.log("Message sent: " + response.message);
			}
			    // if you don't want to use this transport object anymore, uncomment following line
		    //smtpTransport.close(); // shut down the connection pool, no more messages
	});

};