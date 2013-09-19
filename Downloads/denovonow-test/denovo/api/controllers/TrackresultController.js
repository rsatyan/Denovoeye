/*---------------------
	:: Trackresult 
	-> controller
---------------------*/
var rm = require('../rules/RulesMapper')
var dateUtil = require('../utilities/date-util')

var TrackresultController = {

	index : function (req,res) {

		console.log("user level = "+Number(req.user.user_level))

		Companyquestions.findAll({
			companyID:req.user.company_id,
		}).done(function(err,companyQuestions){
			if (err) return res.send(err);
				
				var companyQsForUserLevel = global._.filter(companyQuestions,function(question){ return question.level === Number(req.user.user_level); })

				console.log("company questions(count) = "+companyQsForUserLevel.length)

				Userquestions.findAll({userID:req.user.id.toString()}).done(function(err,userQuestions) {

					if (err) return res.send(err)

					var userQsForUserLevel = global._.filter(userQuestions,function(question){ return question.level === Number(req.user.user_level); })

					var allQuestionsForUserLevel = companyQsForUserLevel.concat(userQsForUserLevel)

					var allQuestions = global._.uniq(allQuestionsForUserLevel,function(question){ return question.questionID})

					var moduleQ = global._.groupBy(allQuestions,'moduleName')
					var qArray = global._.pluck(allQuestions,'Question')
						// console.log(moduleQ);
					var d = ['SUN','MON','TUE','WED','THU','FRI','SAT']

					var todayO = null
					var today = new Date()
					var n = today.getDay()
					var weektimelinehtml = '';


		            for (var  i=6; i >= 0;i--) {
		                    
		               var now = new Date() 
		               now.setDate(today.getDate() - i)
		               var num =  now.getDay()
		               var dayname = d[num]
		               obj = {date : now.getDate(),name : dayname}
		               var spanHtml = ''
		               if (i == 0) {
		                  todayO = obj
		                  spanHtml = '<span onclick="dateSwitched(this)" class="span1 dt sel"><span class="date">'+obj.date+'</span> '+obj.name+'</span>'
		               } else {
		                  spanHtml = '<span onclick="dateSwitched(this)" class="span1 dt"><span class="date">'+obj.date+'</span> '+obj.name+'</span>'
		               }
		               weektimelinehtml = weektimelinehtml + spanHtml
		                    
		             }

		             Userchallenges.findAll({
						userID : req.user.id.toString(),
						done : false
					}).done(function(err,uChallenges){

						if (err) return res.send(err)

						Benefit.findAll().done(function(err,benefits){
							if (err) return res.send(err)

							Benefittracker.findAll({
								userID : req.user.id.toString()
							}).done(function(err,trackers){
								if (err) return res.send(err)

								var utrackers = global._.pluck(trackers,'benefitID')
								var signedUpids = utrackers.join(",")

								var benefitsNotPresent = []
								for(var i=0; i < benefits.length;i++) {
									var currentBenefit = benefits[i]
									if (signedUpids.indexOf(currentBenefit.id.toString()) == -1) benefitsNotPresent.push(currentBenefit.values)
								}

								return res.view({
										user : req.user.values,
										questions : moduleQ,
										qArray : JSON.stringify(qArray),
										todayObject : todayO,
										weekTimeLineHTML : weektimelinehtml,
										challenges : global._.pluck(uChallenges,'values'),
										benefits  : benefitsNotPresent
								});


							})
					
						})	
					});

				});
			
		});
		
	},

	create : function (req,res) {

		var userid = req.user.id.toString()
		var questionID = req.param('question_id')
		var results = req.param('result')
		var timestamp = req.param('timestamp')

	//	[[optionID,itemID,point],[optionID,[itemID,value],point]]

		console.log('track for day : '+ (new Date()).setTime(Number(timestamp)))

		Questions.find({id:questionID}).done(function(err,question){

			if (err) {
				return	res.send(err);
			} else if (!question) {
				return res.send({"errno" : 12010,"message":"Question unavailable"});
			} 
			else {

				var totalpoints = 0;
				for (var i = 0; i < results.length; i++) {

					var result = results[i]
					totalpoints = totalpoints + Number(result[2])

				}
			

				var tracker = {
					userID : userid,
					questionID : questionID,
					point : totalpoints,
					date : Number(timestamp)
				}

				rm.Map(question.rule,tracker,function(success){

					if (success) {

						// Remove all timeline events, reduce points for all timeline events

						var actualdateStart = new Date();
						actualdateStart.setTime(tracker.date)
						actualdateStart.setHours(0,0,0,0);
						var actualdateEnd = new Date();
						actualdateEnd.setTime(tracker.date)
						actualdateEnd.setHours(23,59,59,999);

						Timeline.findAll({
							userId : userid,
							cardType : question.cardType
						}).done(function(err, events) {

							if (err && !events) return res.send(err);

							var tEvents = []
							var reducedPoint = 0
							for (var i=0; i < events.length; i++) {
								var timelineEvent = events[i];
								if (timelineEvent.timestamp >= actualdateStart.getTime() && timelineEvent.timestamp <= actualdateEnd.getTime() && (timelineEvent.questionLevel/question.level) != 1 ) {
									tEvents.push(timelineEvent)
									reducedPoint = reducedPoint + timelineEvent.reward
								}
							}

							for (var j = 0; j < tEvents.length; j++) {
								var timeline = tEvents[j]
								Userrewards.destroy({
									  id : timeline.rewardId
								},function(err) {
									  // Error handling
									  if (err) {
									     console.log(err);

									  } else {
									    console.log("user reward deleted");
									  }
								});

								Timeline.destroy({
									  id : timeline.id.toString()
								},function(err) {
									  // Error handling
									  if (err) {
									     console.log(err);

									  } else {
									    console.log("timeline event deleted");
									  }
								});

							}
							
							// Adding new reward to user rewards array
							var date = new Date();
							date.setTime(Number(timestamp))

						 	Userrewards.create({
						 		"userId"  : userid,
						 		"point"  : totalpoints,				
								"date"    : date.toString(),				
								"month"   : date.getMonth()+1,				
								"day"     : date.getDate(),				
								"year"    : date.getFullYear()								
						 	}).done(function(err,entry){

						 		if (err) return res.send(err)				
						 						
						 		console.log("new reward entry for user: "+entry.values)		

						 		// Add points to user rewards point
								var totalRewardPoints = 0;
								console.log("current user reward points = "+req.user.rewardpoints);

								if (req.user.rewardpoints) totalRewardPoints = req.user.rewardpoints;

								totalRewardPoints = totalRewardPoints - reducedPoint
								totalRewardPoints = totalRewardPoints + totalpoints

								// Update user object with total points
								console.log("total points should be updated to = "+totalRewardPoints);

								User.update({id:userid},{
									rewardpoints : totalRewardPoints
								},function(err,user){

									if (err || !user) console.log(err)
									console.log(user.values);
								})

								var now = new Date()

								Timeline.create({
									questionId : questionID,
									userId : userid,
									Question : question,
									reward   : totalpoints,
									result : results,
									moduleID : question.module_id,
									questionLevel : question.level,
									rewardId : entry.id.toString(),
									questionLevel : question.level,
									cardType : question.cardType,
									timestamp : Number(timestamp)
								}).done(function(err,timeline){
									if (err) return res.send(err)
									console.log("new timeline event: "+timeline.values);
									return res.send({"success" : true});
								});					

						 	});

						});

					} else {
						return res.send({"errno" : 12011,"message":"you are not allowed to respond"})
					}

				});

				

			}

		});
						
	},

	checkIfUserHasAnsweredQuestion : function (req,res) {

		var timestamp = Number(req.param('timestamp'));
		var actualdateStart = new Date();
		actualdateStart.setTime(timestamp)
		actualdateStart.setHours(0,0,0,0);
		var actualdateEnd = new Date();
		actualdateEnd.setTime(timestamp)
		actualdateEnd.setHours(23,59,59,999);

		Timeline.findAll({
			userId : req.user.id.toString(),
			questionId : req.param('questionID')
		}).done(function(err, events) {

			if (err) return res.send({
						"questionId":req.param('questionID'),
						"success" : false
					});

			if (!events || events.length == 0) return res.send({
																	"questionId":req.param('questionID'),
																	"success" : false
																});

			for (var i = 0; i < events.length; i++) {
				var currentEvent = events[i]
				if (currentEvent.timestamp >= actualdateStart.getTime() && currentEvent.timestamp <= actualdateEnd.getTime()) {
					return res.send({
						"questionId":req.param('questionID'),
						"success" : true
					});
				}
			}
			return res.send({
						"questionId":req.param('questionID'),
						"success" : false
					});

		});
	},

	getdayCountForQuestion : function(req,res) {

		var questionID = req.param('questionID')
		Timeline.findAll({
			userId : req.user.id.toString(),
			questionId : questionID
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
				console.log("days tracked for question : "+questionID+" = "+count);
				return res.send({"success":true,"count":count})
		});

	},

	getPointForQuestion : function (req,res) {
		
		var questionID = req.param('questionID')
		Questions.find({id:questionID}).done(function(err,question){
			if(err) return res.send({"success":false,"message":err})

			var point = 0
			for (var i=0; i < question.options.length; i++) {
				var option = question.options[i]
				var itempoint = 0
				for (var j = 0; j < option.items.length; j++) {
					var item = option.items[j]
					if (Number(item.point) > itempoint) itempoint = Number(item.point)
				}
				point = point + itempoint
			}	
			console.log("max total points for question : "+questionID+" = "+point);
			return res.send({"success":true,"point":point})
		}) 
	}


};
module.exports = TrackresultController;