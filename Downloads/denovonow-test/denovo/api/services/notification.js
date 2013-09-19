/*
Notification service  to send mail, sms, apple push notification, google cloud messaging
*/

var twilio = require('./twilioclient')
var mailer = require('./mailer')
var pushnotificationservice = require('./pnservice')

exports.Notify = function(srcid,userid,type,description,date) {

	console.log("notify "+type+" for user: "+userid);

	User.find({id:userid}).done(function(err,user){

		if (err) return console.log("notification service cannot find the user");

		var subject = "Notification about your "+type;
		var htmlbody = [ '<p>Welcome to <b>Denovonow</b></p><br/>',
                         description+' at <br />',
                        date.toString()].join("");

		mailer.sendMail(user,subject,htmlbody);
		twilio.sendSMS('+919400505631',description+" at "+date.toString())
		// var users = new Array();
		// users.push(user)
		// pushnotificationservice.push(users,description+" at "+date.toString());

		// Create a new entry for notification
		Notification.create({
			userId : userid,
			message : description,
			type : type,
			date : date.toString(),
			sourceID : srcid,
			read : false
		}).done(function(err,notification){

			if (err) return console.log(err);
			return console.log(notification.values);
		});
		
	});

}