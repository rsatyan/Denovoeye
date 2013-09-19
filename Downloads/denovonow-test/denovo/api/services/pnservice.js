/*
Push notification service to send messages to all devices of the user

*/
var CONFIG = require('config');

var apn = require('apn');
var options = { 
	"cert" : CONFIG.APPLE_PUSH_NOTIFICATION.CERTIFICATE,
	"key"  : CONFIG.APPLE_PUSH_NOTIFICATION.KEY,
	"gateway": CONFIG.APPLE_PUSH_NOTIFICATION.GATEWAY 
};
var apnConnection = new apn.Connection(options);

var GCM = require('gcm').GCM;
var gcm = new GCM(CONFIG.GOOGLE_CLOUD_MESSAGING.APITOKEN);



var apnMessage = function(alertmessage) {

	var note = new apn.Notification();
	note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
	note.badge = 3;
	note.sound = "ping.aiff";
	note.alert = alertmessage;
	note.payload = {'messageFrom': 'Denovo'};
	return note;
};

var gcmMessage = function(registrationId,message) {
	return message = {
    registration_id: registrationId, // required
    collapse_key: 'demo', 
    'data.key1': message
	}
};

var pushToAndroid = function(registrationId,message){

	var msg = gcmMessage(registrationId,message);

	gcm.send(message, function(err, messageId){
    	if (err) {
        	console.log("GCM : Something has gone wrong!");
    	} else {
        	console.log("GCM : Sent with message ID: ", messageId);
    	}
	});

};

var pushToiOS = function(deviceToken,message){

	var msg = apnMessage(message);
	var device = new apn.Device(deviceToken);
	apnConnection.pushNotification(msg,device);
};

var pushToDevice = function (deviceToken,deviceOS,message) {

	if (deviceOS === 'android') {
		pushToAndroid(deviceToken,message);
	} else if(deviceOS === 'ios'){
		pushToiOS(deviceToken,message);
	}
}

exports.push = function(users,message) {

	for (var i = 0; i < users.length; i++) {

		var current_user = users[i];

		Device.findAll({user_id:current_user.id.toString()}).done(function(err,devices){

			if (err) return console.log("no devices registered for the user : "+current_user.id.toString());

			for (var j = 0; j < devices.length;j++) {
				var device = devices[j];
				pushToDevice(device.deviceToken,device.OS,message);
			}
		});

	}

};