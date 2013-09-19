// App bootstrap
// Code to run before launching the app
//
// Make sure you call cb() when you're finished.
var bcrypt = require('bcrypt-nodejs');
var scheduler = require('../api/services/scheduler');

global.CONFIG = require('config');

module.exports.bootstrap = function (cb) {

	User.findByUsername(global.CONFIG.Admin.USERNAME).done(function(err, user){
		if (user) return console.log("admin user already present");

		User.create({
				provider: 'local',
				provideruid:'1',
				name:global.CONFIG.Admin.NAME,
				username:global.CONFIG.Admin.USERNAME,
				password:bcrypt.hashSync(global.CONFIG.Admin.PASSWORD)
		}).done(function(err,user){

			if (err) console.log(err);
			console.log(user.values);
		});
	});

	Appointment.findAll({"active":true}).done(function(err,appointments){

		if (err) {
			console.log(err);
		} else {

			for (var i = 0; i < appointments.length;i++){

				console.log("rescheduling cron job for appointment: "+appointments[i].id.toString());
				var currentAppointment = appointments[i];
				scheduler.scheduleAppointment(currentAppointment);
			}

		}

		return

	});

	Userchallenges.findAll({"done":false}).done(function(err,challenges){

		if (err) {
			console.log(err);
		} else {

			for (var i = 0;i < challenges.length; i++) {

				var currentChallenge = challenges[i];
				scheduler.scheduleChallenge(currentChallenge);			
			}

		}

		return

	});

	Sweepstake.findAll({active:true}).done(function(err,sweepstakes){

		if (err) {
			console.log(err);
		} else {

			for (var i = 0;i < sweepstakes.length; i++) {

				var currentsweepstake = sweepstakes[i];
				scheduler.scheduleSweepStake(currentsweepstake);			
			}

		}

		return

	})

	cb();

};