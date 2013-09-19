/*---------------------
	:: Provider 
	-> controller
---------------------*/
var ProviderController = {

	index : function (req,res) {

		Provider.findAll().done(function(err,providers){

			if (err) return res.send(err)

			return res.view({providers : global._.pluck(providers,'values') });

		})
		
	},

	create : function (req,res) {

		var name = req.param('name')
		var subtext = "***"
		if (req.param('subtext')) subtext = req.param('subtext')
		phoneNumber = "555-555-5555"
		if (req.param('phoneNumber')) phoneNumber = req.param('phoneNumber')
		var speciality = req.param('speciality')
		var plan = req.param('plan')
		var location = req.param('location')
		var imgurl = "img/contact-img.png"

		Provider.create({
			name: name,
			subtext  : subtext,
			phoneNumber: phoneNumber,
			speciality : speciality,
			plan : plan,
			location : location,
			imgurl : imgurl,
		}).done(function(err,provider){

			if (err) return res.send(err)
			return res.send(provider.values)

		})

	}

};
module.exports = ProviderController;