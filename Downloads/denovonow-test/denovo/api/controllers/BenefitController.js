/*---------------------
	:: Benefit 
	-> controller
---------------------*/
var mailer = require('../services/mailer')

var BenefitController = {

	signup : function (req,res) {

		// user signs up for benefits,
		var userid = req.user.id.toString()
		var benefitid = req.param('benefitID')

		Benefit.find({id:benefitid}).done(function(err,benefit){

			if (err) return res.send({"success" : false,"message":err})

			if (!benefit) return res.send({"success" : false,"message":"no such benefit found"})

			Benefittracker.create({
				userID : userid,
				benefitID : benefitid,
				activated : false,
				point : benefit.point
			}).done(function(err,benefittracker){

			if (err) return res.send({"success" : false,"message":err});

			var user = {
				email : benefit.adminEmail
			}
			var subject = req.user.name+" has signed up for Benefit "+benefit.title;
			var htmlbody = 'Please dont forget to activate '+req.user.name+' sign up request<br/>';

			mailer.sendMail(user,subject,htmlbody);

			return res.send({"success" : true,"tracker" : benefittracker.values})

			})

		})

	},

	create : function (req,res) {

		var endDate = new Date(req.param('endDate'))
		var adminEmail = req.param('adminEmail')
		var point = Number(req.param('point'))

		var description = "Empty Benefit"
		if (req.param('description')) description = req.param('description')
		var imgurl = "/img/300x200.png"
		if (req.param('imgurl')) imgurl = req.param('imgurl')
		var title = "Empty Title"
		if (req.param('title')) title = req.param('title')

		Benefit.create({
			imgurl : imgurl,
			title : title,
			description : description,
			endDate : endDate,
			adminEmail : adminEmail,
			point : point
		}).done(function(err,benefit){

			if (err) return res.send(err)

			return res.send(benefit.values)
		})
	}

};
module.exports = BenefitController;