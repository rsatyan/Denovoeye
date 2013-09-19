/*---------------------
	:: Redemptionitem 
	-> controller
---------------------*/
var dateUtil = require('../utilities/date-util')

var RedemptionitemController = {

	redeemItem :  function (req,res) {

		//get /user/:user_id/redeem/item/:item_id

		var redemptionItemId = req.param('item_id');

		Redemptionitem.find({id:redemptionItemId}).done(function(err,item){

			if (err) return res.send(err);

			// Found redemption item.
			// Find user, redeem item if possible, and add to user redemption history

			User.find({id:req.user.id.toString()}).done(function(err,user) {

				if (err) return res.send(err);

				if (user.rewardpoints < item.points) return res.send("you do not have enough points to redeem this item");

				// Calculating total user points, after deducting donated points
				var userPoints = user.rewardpoints -  item.points;

				// Calculating total donated points
				var redeemedPoints = 0
				if (user.pointsDonated) redeemedPoints = user.pointsDonated
				redeemedPoints = redeemedPoints + item.points;

				// Updating user object
				User.update({id:req.user.id.toString()},{
					"rewardpoints":userPoints,
					"pointsDonated" : redeemedPoints,
				},function(err,user){

					if (err) return res.send(err);

					res.send(user.values);

					req.user = user.values

					// Add new entry to redemption tracker / redemption history of user
					Redemptiontracker.create({
						redemptionItem:item.values,
						userId : user.id.toString(),
						companyId : user.company_id
					}).done(function(err,row){

						if (err) console.log(err);
						
						console.log(row.values);

					});

					// Update Redemption Item with contribution
					var contribution = 0;
					if (item.contribution) contribution = Number(item.contribution)
					var contribution =  contribution + Number(item.points);
					Redemptionitem.update({id:redemptionItemId},{"contribution":Number(contribution)},function(err,item){
						if (err) console.log(err);
						console.log(item.values);
					});

					return ;

				});

			})

		})
	},

	index : function (req,res) {

		
			Redemptionitem.findAll().done(function(err,items){
				if (err) return res.send(err);

				CompanySweepstake.findAll({companyID:req.user.company_id}).done(
					function(err,sweepstakes){

						if (err) return res.send(err);

						return res.view({
							user : req.user.values,
							redemptionItems:global._.pluck(items,'values'),
							sweepstakes : global._.pluck(sweepstakes,'values'),
							jSweepstakes : JSON.stringify(global._.pluck(sweepstakes,'values'))
						});

					});

			});	
	}

};
module.exports = RedemptionitemController;