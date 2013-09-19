
/*
Service to schedule Cron jobs
*/

var cronutils = require('../utilities/cronUtils');
var cronJob = require('cron').CronJob;
var notifier = require('./notification');
var sweepstakeController = require('./sweepstakeselector')

exports.scheduleChallenge = function (uChallenge){

	var today = new Date();

	console.log("Challenge start date = "+uChallenge.startDate.toString()+", end date = "+uChallenge.endDate.toString());

	var startCronFormat = cronutils.cronformat(uChallenge.startDate,"once")
	var endCronFormat = cronutils.cronformat(uChallenge.endDate,uChallenge.challenge.notification)

	if (today.getTime() >= uChallenge.endDate.getTime()) {

		console.log("challenge has ended, but is incomplete");

		// notifier.Notify(challenge.user_id,"Challenge","You've failed to complete Challenge, "+challenge.description,challenge.endDate);

	}else if (today.getTime() >= uChallenge.startDate.getTime() && today.getTime() < uChallenge.endDate.getTime()) {
				
		console.log("challenge has already started. Only need reminders for end date of challenge");

		var endCronFormat = cronutils.cronformat(uChallenge.endDate,uChallenge.challenge.notification);

		console.log("cron format generated = "+endCronFormat);

		var challengeReminderJob = new cronJob(endCronFormat, function(){

					console.log("send notification for challenge : "+uChallenge.id.toString());
					var now = new Date();
					if (now.getTime() < uChallenge.endDate.getTime()) {
						notifier.Notify(uChallenge.id.toString(),uChallenge.user_id,"Challenge",uChallenge.challenge.description,uChallenge.endDate);
					} else if (now.getTime() === uChallenge.endDate.getTime()) {
						notifier.Notify(uChallenge.id.toString(),uChallenge.user_id,"Challenge","Your Challenge, "+uChallenge.challenge.description+", end now !",uChallenge.endDate);
					}	
		}, null, 
 		true /* Start the job right now */,
  		uChallenge.timeZone /* Time zone of this job. */
		);

	} else {

		console.log("challenge has not started");

		var job = new cronJob(startCronFormat, function(){
			// job started on "start date" of challenge. Remind user about the challenge start
			console.log("send start notification for challenge : "+uChallenge.id.toString());
			notifier.Notify(uChallenge.id.toString(),uChallenge.user_id,"Challenge","Your Challenge, "+uChallenge.challenge.description+", starts today !",uChallenge.startDate);

			var challengeReminderJob = new cronJob(endCronFormat, function(){

					console.log("send notification for challenge : "+uChallenge.id.toString());
					var now = new Date();
					if (now.getTime() < uChallenge.endDate.getTime()) {
						notifier.Notify(uChallenge.id.toString(),uChallenge.user_id,"Challenge",uChallenge.challenge.description,uChallenge.endDate);
					} else if (now.getTime() === uChallenge.endDate.getTime()) {
						notifier.Notify(uChallenge.id.toString(),uChallenge.user_id,"Challenge","Your Challenge, "+uChallenge.challenge.description+", end now !",uChallenge.endDate);
					}			
			}, null, 
 			true /* Start the job right now */,
  			uChallenge.timeZone  /* Time zone of this job. */
			);
 		}, null, 
 		true /* Start the job right now */,
  		uChallenge.timeZone /* Time zone of this job. */
		);
	}

};

exports.scheduleAppointment = function(appointment){

	var cronformat = cronutils.cronformat(appointment.date,appointment.notification);

	var job = new cronJob(cronformat, function(){
				
    	if (appointment.active) {
    		var currentDate = new Date();
    		console.log("send notification for appointment id : "+appointment.id.toString()+" at time: "+currentDate.toString());

    		if (currentDate.getTime() <= appointment.date.getTime()) {
    			 notifier.Notify(appointment.id.toString(),appointment.user_id,"Appointment",appointment.description,appointment.date);
    		}

    		if (appointment.notification === "once") {
    			Appointment.update({id:appointment.id},{"active":false},function(err,appointment){
    				if (err) console.log ("appointment id : "+appointment.id+" err : "+err);
    			});
    		}
    	}
    			

 	}, null, 
 	true /* Start the job right now */,
  	appointment.timezone/* Time zone of this job. */
	);

};

exports.scheduleSweepStake = function(sweepstake) {

	var job = new cronJob(sweepstake.endDate, function(){

		
		Sweepstake.find({id:sweepstake.id.toString()}).done(function(err,currentSweepstake){

			if (currentSweepstake.active) {
	    		Sweepstake.update({
					id : currentSweepstake.id.toString()
				},{
					"active" : false
				},function(err,nsweepstake){

					if (err) console.log(err);

					if (!nsweepstake) console.log("scheduler: sweepstake not found");

					CompanySweepstake.findAll({
						sweepstakeID : currentSweepstake.id.toString()
					}).done(function(err,cSweepstakes){

						if (err) return res.send(err);

						if (!cSweepstakes || cSweepstakes.length == 0) return console.log("sweepstakes not found")

						var list = global._.pluck(cSweepstakes,"companyID")

						sweepstakeController.chooseWinner(nsweepstake,list)
						
						// disabled, remove from company listing,
						for (var i=0; i < cSweepstakes.length; i++) {
							CompanySweepstake.destroy({
								id : cSweepstakes[i].id.toString()
							},function(err) {
								// Error handling
								if (err) {
									console.log(err);
								} else {
									console.log("company sweepstake deleted");
								}
							});
						}

					});
				});
	    	}

		});

 	}, null, 
 	true
  	);
};