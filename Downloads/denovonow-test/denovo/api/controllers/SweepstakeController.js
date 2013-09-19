/*---------------------
	:: Sweepstake 
	-> controller
---------------------*/
var scheduler = require('../services/scheduler');

var SweepstakeController = {

	findAll : function (req,res) {

		CompanySweepstake.findAll({
			companyID : req.user.company_id
		}).done(function(err,sweepstakes){

			if (err) return res.send(err);

			if (!sweepstakes || sweepstakes.length == 0) return res.send({"errNo" : 12014,"message" : "sweepstakes not found"})

			var arr = []
			for (var i = 0 ; i < sweepstakes.length; i++) {

				var currentSweepStake = sweepstakes[i]
				if (currentSweepStake.sweepStake.active) arr.push(currentSweepStake.sweepStake)

			}
			return res.send(arr)
		});
	},

	update : function(req,res) {

		Sweepstake.update({
				id : req.param('id')
			},{
				"description" : req.param('description'),
				"cost" : req.param('cost'),
				"endDate" : new Date(req.param('endDate')),
				"active" : req.param('active')
			},function(err,sweepstake){
					
				if (err) return res.send(err);

				if (!sweepstake) return res.send({"errNo" : 12014,"message" : "sweepstakes not found"})

				CompanySweepstake.findAll({
					sweepstakeID : sweepstake.id.toString()
				}).done(function(err,cSweepstakes){

					if (err) return res.send(err);

					if (!cSweepstakes || cSweepstakes.length == 0) return res.send({"errNo" : 12014,"message" : "sweepstakes not found"})

					if (req.param('active')) {
						// still active
						for (var i=0; i < cSweepstakes.length; i++) {
								CompanySweepstake.update({
									id : cSweepstakes[i].id.toString()
								},{
									"sweepStake" : sweepstake
								},function(err,result) {

									if (err) console.log(err)

									if (!result) console.log("sweepstakes not found")

									console.log(result.values)

								})
						}

					} else {
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

					}

					return res.send({"success" : true})

				});

		});
	},

	create : function (req,res) {

		var endDate = new Date(req.param('endDate'))

		var active = true
		if (req.param('active')) active = req.param('active')

		var imgurl = "/img/300x200.png"

		if (req.param('imgurl')) imgurl = req.param('imgurl')

		Sweepstake.create({
			description : req.param('description'),
			cost : req.param('cost'),
			endDate : endDate,
			active : active,
			imgurl : imgurl
		}).done(function(err,sweepstake){

			if (err) return res.send(err)

			if (!sweepstake) res.send({"errNo" : 12014,"message" : "sweepstakes not found"})

			scheduler.scheduleSweepStake(sweepstake);

			return res.send(sweepstake.values)

		});

	}

};
module.exports = SweepstakeController;