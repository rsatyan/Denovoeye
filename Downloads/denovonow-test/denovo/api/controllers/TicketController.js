/*---------------------
	:: Ticket 
	-> controller
---------------------*/
var TicketController = {

	create : function (req,res) {

		Sweepstake.find({id:req.param('sweepstakeID')}).done(function(err,sweepstake){

			if (err) return res.send(err)

			if (!sweepstake) return res.send({"errNo" : 12015,"message" : "sweepstake not found"})

			if (req.user.rewardpoints < sweepstake.cost) return res.send("you do not have enough points to redeem this item");

			// Calculating total user points, after deducting ticket purchase cost points
			var userPoints = req.user.rewardpoints -  sweepstake.cost;

			User.update({
				id:req.user.id.toString()
			},{
				"rewardpoints":userPoints,
			},function(err,user){
					
				if (err) return res.send(err);
				if (user) console.log(user.values)

				Ticket.create({
					sweepstakeID : sweepstake.id.toString(),
					userId : req.user.id.toString(),
					useremail : req.user.email,
					companyID : req.user.company_id
				}).done(function(err,ticket){

					if (err) return res.send(err)

					if (!ticket) return res.send({"errNo" : 12016,"message" : "error while purchasing ticket"})
						
					return res.send(ticket.values);
				})

			});

		});

	},

	getCountOfTickets : function (req,res) {

		Ticket.count({sweepstakeID:req.param('sweepstakeID')}, {}, function(err, count) {

			if (err) return res.send({"success" : false,"message" : err});
			console.log("count received for " + req.param('sweepstakeID') + " : " + count)
			return res.send({"success" : true,"count" : count})
        
      	});

	}

};
module.exports = TicketController;