/*---------------------
	:: Userchallenges 
	-> controller
---------------------*/
var scheduler = require('../services/scheduler');
var dateUtil = require('../utilities/date-util')
var fs = require('fs')
var util = require('../utilities/utils')

var UserchallengesController = {

	create : function(req,res) {

		var eDate = new Date(req.param('endDate'))
		var endDate = dateUtil.convertDateToUserTimezone(eDate,req.user.timeZoneOffset)

		var sDate = new Date()
		var startDate = dateUtil.convertDateToUserTimezone(sDate,req.user.timeZoneOffset)

		var duration = Number(dateUtil.diffInDays(startDate,endDate))

		var notification = "daily"
		if (req.param('notification')) notification = req.param('notification')
		var desc = "Empty Challenge"
		if (req.param('description')) desc = req.param('description')
		
		var title = "Empty Title"
		if (req.param('title')) title = req.param('title')

		console.log('do file upload :'+req.files.displayImage.path);

		var pictureID = util.uid(16)

		fs.readFile(req.files.displayImage.path, function (error, data) {
			var newPath = process.cwd()+"/public/img/challenge/"+pictureID+'.png';

			fs.writeFile(newPath, data, function (err) {

				if (err) return res.send({"success":false,"message":err});

				var url = "/img/challenge/"+pictureID+'.png'

				Challenges.create({
					title : title,
					description: desc,
					notification: notification,
					duration : duration,
					imgURL : url
				}).done(function(err,newchallenge){

					if (err) return res.send(err);

					Userchallenges.create({
						userID : req.user.id.toString(),
						challengeId : newchallenge.id.toString(),
						endDate : endDate,
						startDate : startDate,
						done : false,
						timeZone : dateUtil.userTimeZoneShortenedString(req.user.timeZoneString),
						challenge : newchallenge.values
					}).done(function(err,uChallenge){
						if (err) return res.send(err)

						res.send(uChallenge.values)
						scheduler.scheduleChallenge(uChallenge)
						return;
					})
				});	

			})
		});
	},

	markChallengeAsCompleted : function (req,res) {

		Userchallenges.update({
			id : req.param('id')
		},{"done":true},function(err,uChallenge){

			if (err) return res.send(err);

			res.send(uChallenge.values);

			var completed = 0;
			if (req.user.challengesCompleted) completed = req.user.challengesCompleted;
			completed++

			User.update({
				id:req.user.id.toString()
			},{
				challengesCompleted : completed
			},function(err,user){
				if (err || !user) console.log(err)
				console.log(user.values);
				return;
			});

		});
	},

	index : function (req,res) {

		Userchallenges.findAll({userID : req.user.id.toString()}).done(function(err,userchallenges){

			if (err) console.log(err)

			Challenges.findAll().done(function(err,challenges){
				if (err) return res.send(err);

				var uChallenges = global._.pluck(userchallenges,'challengeId')
				var ids = uChallenges.join(",")

				var challengesNotPresent = []

				for(var i=0; i < challenges.length;i++) {
					var currentchallenge = challenges[i]
					if (ids.indexOf(currentchallenge.id.toString()) == -1) challengesNotPresent.push(currentchallenge.values)
				}


				return res.view({
					user : req.user.values,
					challenges : JSON.stringify(challengesNotPresent)
				});
			});

		})
		

	},

	addChallenge : function (req,res) {

		Userchallenges.find({
			challengeId:req.param('challengeID'),
			userID : req.user.id.toString()
		}).done(function(err,Challenge){

			if (err) return res.send(err);

			if (Challenge) return res.send(Challenge.values);

			console.log('no such user challenge present');

			Challenges.find({id:req.param('challengeID')}).done(function(err,challenge){

				if (err) return res.send(err);

				if (!challenge) return res.send({"errNo" : 120016,"message":"no such challenge found"});

				var sDate = new Date()
				var startDate = dateUtil.convertDateToUserTimezone(sDate,req.user.timeZoneOffset)

				var timeOffset = (challenge.duration * 24 * 60 * 60 * 1000);
				var endTime = startDate.getTime() + timeOffset;

				var eDate = new Date()
				var endDate = dateUtil.convertDateToUserTimezone(eDate,req.user.timeZoneOffset)
				
				endDate.setTime(endTime);

				Userchallenges.create({
					userID : req.user.id.toString(),
					challengeId : challenge.id.toString(),
					endDate : endDate,
					startDate : startDate,
					done : false,
					timeZone : dateUtil.userTimeZoneShortenedString(req.user.timeZoneString),
					challenge : challenge.values
				}).done(function(err,uChallenge){

					if (err) return res.send(err)
					res.send(uChallenge.values)
					scheduler.scheduleChallenge(uChallenge)
					return;
				});

			});

		});

	},

	trackchallenge : function(req,res) {

		Challengetracker.create({
			userid : req.user.id.toString(),
			challengeID : req.param('challengeID')
		}).done(function(err,tracker){
			if(err) return res.send(err)
			return res.send(tracker)
		})
	},

	getdayCountForChallenge : function(req,res) {

		var challengeID = req.param('challengeID')
		Challengetracker.findAll({
			userid : req.user.id.toString(),
			challengeID : challengeID
		}).done(function(err, events) {

				if(err) return res.send({"success":false,"message":err})
				var uniquedays = {}
				for (var i = 0; i < events.length; i++) {
					var currentEvent = events[i]
					var key = currentEvent.createdAt.getDate()+'-'+currentEvent.createdAt.getMonth()+'-'+currentEvent.createdAt.getFullYear()
					uniquedays[key] = 1
				}
				var count = 0
				for (key in uniquedays) count++
				console.log("days tracked for challenge : "+challengeID+" = "+count);
				return res.send({"success":true,"count":count})
		});

	}


};
module.exports = UserchallengesController;