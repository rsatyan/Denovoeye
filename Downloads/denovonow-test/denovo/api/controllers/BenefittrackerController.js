/*---------------------
	:: Benefittracker 
	-> controller
---------------------*/
var notifier = require('../services/notification');

var enableDentalModuleForUser = function(user) {
	// (dental module : 51ca88ae251cab53ac000008)
	Companyquestions.findAll({
		moduleID:"51ca88ae251cab53ac000008",
		companyID : user.company_id
	}).done(function(err,results){

		if (err) return console.log(err)

		if (results.length == 0) {

			console.log("enable dental module for user");
			Questions.findAll({module_id:"51ca88ae251cab53ac000008"}).done(function(err,questions){

				if (err) return console.log(err);

				for (var i=0; i < questions.length; i++) {
					var question = questions[i]

					Userquestions.create({
						userID : user.id.toString(),
						moduleID : '51ca88ae251cab53ac000008',
						questionID : question.id.toString(),
						Question : question.values,
						cardType : question.cardType,
						moduleName : 'dental',
						level : Number(question.level)
					}).done(function(err,item){
						if (err) console.log(err);
						console.log(item.values);

					});
				}

			});

		} else {
			console.log("dental module is already present for the user, his/her company has subscribed it");
		}

	});

}

var BenefittrackerController = {

	activeBenefit : function(req,res) {

		// put /benefittracker/:id/activate/:userID
		Benefittracker.update({
			id : req.param('id'),
		},{
			activated : true
		},function(err,benefittracker){

			if (err) return res.send(err)

			if (!benefittracker) return res.send("benefit tracker not found/updated");

			var date = new Date()

			Userrewards.create({
				"userId"  : benefittracker.userID,
				"point"  : benefittracker.point,
				"date"    : date.toString(),
				"month"   : date.getMonth()+1,
				"day"     : date.getDate(),
				"year"    : date.getFullYear()
			}).done(function(err,entry){

				if (err) return res.send(err)

				var totalRewardPoints = 0;
				
				console.log("current user reward points = "+req.user.rewardpoints);
				console.log("benefit sign up points = "+benefittracker.point)

				if (req.user.rewardpoints) totalRewardPoints = Number(req.user.rewardpoints)

				totalRewardPoints = totalRewardPoints + Number(benefittracker.point)

				console.log("current user reward points should be updated to :"+totalRewardPoints)

				User.update({
					id:benefittracker.userID
				},{
					rewardpoints : totalRewardPoints
				},function(err,user){

					if (err || !user) console.log("error while updating user points : "+err)

					console.log("benefit activated for user, points updated to : "+user.values);

					// if benefitID = 5209d150587399804d000002, then enable the dental cards 
					if (benefittracker.benefitID === '5209d150587399804d000002') {
						enableDentalModuleForUser(user)
					}


					notifier.Notify(benefittracker.benefitID,benefittracker.userID,"benefit","Your sign up request has been accepted",date);

					return res.send(benefittracker.values);
				});

			})	
		});
	}

};
module.exports = BenefittrackerController;