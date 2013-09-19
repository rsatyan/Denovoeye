/*---------------------
	:: Challenges 
	-> controller
---------------------*/
var scheduler = require('../services/scheduler');

var ChallengesController = {

	create : function (req,res) {

		var notification = "daily"
		if (req.param('notification')) notification = req.param('notification')
		var desc = "Empty Challenge"
		if (req.param('description')) desc = req.param('description')
		var img = "/img/300x200.png"
		if (req.param('imgURL')) img = req.param('imgURL')
		var title = "Empty Title"
		if (req.param('title')) title = req.param('title')
		
		Challenges.create({
			title : title,
			description: desc,
			notification: notification,
			duration : req.param('duration'),
			imgURL : img
		}).done(function(err,challenge){

			if (err) return res.send(err);
			return res.send(challenge.values);

		});

	},

};
module.exports = ChallengesController;
