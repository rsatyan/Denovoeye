/*---------------------
	:: User 
	-> controller
---------------------*/
var dateUtil = require('../utilities/date-util')
var bcrypt = require('bcrypt-nodejs')
var fs = require('fs')

var UserController = {

	index :  function (req, res) {
		User.findAll().done(function(err,users){
			if (err) return res.send(err);
			return res.send(global._.pluck(users,'values'));
		});
	},

	findUsersByCompanyId : function (req, res) {

		var companyid = req.param('id');

		User.findAllByCompany_id(companyid).done(function(err, users) {
			if (err) {
				return res.send(err);
				// Found multiple users!
            } else {
                return res.send(global._.pluck(users,'values'));
            }
        });
	},

	addCompany : function (req, res) {

		var userid = req.param('user_id');
		var companyId = req.param('company_id');

		Company.find({id:companyId}).done(function(err,company){

			if (err) return res.send(err)

			User.update({id : userid},{
				"company_id" : companyId,
				"company_name" : company.name
			}, function(err, user) {
				if (err) {
					return res.send(err);
				} else {
					return res.send(user.values);
				}

			});

		})
		
	},

	addprovider :  function (req,res){

		var userid = req.param('user_id')
		var providerid = req.param('provider_id')

		Provider.find({id:providerid}).done(function(err,provider){

			if (err) return res.send(err);

			Userproviders.create({
				userID : userid,
				providerID : providerid,
				provider : provider,
			}).done(function(err,user){

			});

		});

	},

	getAllQuestionsForUser : function(req,res) {

		Companyquestions.findAll({
			companyID:req.user.company_id
		}).done(function(err,collection){
			if (err) return res.send(err);
			return res.send(global._.pluck(collection,'Question'));
		});
		
	},

	getStat : function (req,res) {

			Userrewards.findAll({
				userId : req.user.id.toString()
			}).done(function(err,rewards){

				var userrewards = null
				if (err) {
					console.log(rewards);
					userrewards = [];
				} else {
					userrewards = rewards
				}

				// Get Previous Month Date
				var previousMonthdate = new Date();
				dateUtil.setToPreviousMonth(previousMonthdate)

				// Get Last Week Date
				var lastWeekDate = new Date();
				dateUtil.setToPreviousWeek(lastWeekDate)

				var today = new Date()
				today.setHours(0,0,0,0)

				var pointsfortoday = 0
				var pointsforlastmonth = 0
				var pointsforlastWeek = 0

				totalpoints = 0
				if (req.user.rewardpoints) totalpoints = req.user.rewardpoints

				if (userrewards) {
					for (var i = 0; i < userrewards.length; i++) {
						var rewarddate = new Date(userrewards[i].date);
						
						if (rewarddate.getTime() > previousMonthdate.getTime()) {
							pointsforlastmonth = pointsforlastmonth + userrewards[i].point
						}

						if (rewarddate.getTime() > lastWeekDate.getTime()) {
							pointsforlastWeek = pointsforlastWeek + userrewards[i].point
						}

						if (rewarddate.getTime() > today.getTime()) {
							pointsfortoday = pointsfortoday + userrewards[i].point
						}
					}
				}

				return res.send({
					"totalPoints" : totalpoints,
					"pointsForLastMonth" : pointsforlastmonth,
					"pointsForLastWeek" : pointsforlastWeek,
					"pointsForToday" : pointsfortoday
				});
			});

	},

	updateTrackerLevel : function (req,res) {

		User.update({id : req.user.id.toString()},{"user_level" : Number(req.param('level'))}, function(err, user) {

			if (err) {
				return res.send(err);
			} else {
				return res.send(user.values);
			}

		});
	},

	uploadDisplayImage : function(req,res) {

		console.log('file upload :'+req.files.displayImage.path);

		fs.readFile(req.files.displayImage.path, function (error, data) {

			var newPath = process.cwd()+"/public/img/displaypictures/"+req.user.id.toString()+'.png';

			fs.writeFile(newPath, data, function (err) {
				if (err) return res.send({"success":false,"message":err});

				var url = "http://"+req.headers.host+"/img/displaypictures/"+req.user.id.toString()+'.png'
				User.update({
					id : req.user.id.toString()
				},{
					"displayimg" : "/img/displaypictures/"+req.user.id.toString()+".png"
				}, function(err, user) {

					if(err) return res.send({"success" : false,"message":err})

					return res.send({"success":true,"url":url});
				});
				
			});
		});

	},

	updateprofile : function (req,res) {

		var firstname = req.param('firstname')
		var lastname = req.param('lastname')
		var company_name = req.param('companyname')
		var email = req.param('email')
		var username = req.param('username')
		var password = req.param('password')
		var timezonestring = req.param('timezone')
		var timezoneoffset = req.param('offset')

		var offsetarr = timezoneoffset.split(",")
		var offset = Number(offsetarr[0])
		console.log('timezone offset received = '+offset)

		var hash = bcrypt.hashSync(req.param("password"));

		User.findAll({"username":username}).done(function(err,users){

			if (err) return res.send({"success" : false,"message":err});

			if (users.length > 1) {
				return res.send({"success":false,"message":"the username has already been taken"})
			} else if (users[0] && users[0].id.toString() != req.user.id.toString()) {
				return res.send({"success":false,"message":"the username has already been taken"})
			}

			Company.find({"name":company_name}).done(function(err,company){

				if (err) return res.send({"success":false,"message":err})

				if (!company) return res.send({"success":false,"message":"no such company found"})

				User.update({
					id : req.user.id.toString()
				},{
					"firstname" : firstname,
					"lastname" : lastname,
					"company_name" : company_name,
					"company_id" : company.id.toString(),
					"email" : email,
					"username" : username,
					"password" : hash,
					"timeZoneString" : timezonestring,
					"timeZoneOffset" : offset
				}, function(err, user) {

					if(err) return res.send({"success" : false,"message":err})

					return res.send({"success":true,"user":user.values});
				});

			})

		})	
	}

};
module.exports = UserController;