/**
 * SweepstakewinnerController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */
var notifier = require('../services/notification');

module.exports = {

	confirmWinner : function(req,res) {

		var id = req.param('id')
		Sweepstakewinner.update({id:id},{
			confirmed : true,
		},function(err,winner){

			if (err) return res.send(err)

			// Winner confirmed. Send mail to winner, with details about sweepstake
			notifier.Notify(winner.id.toString(),winner.userID,"Sweepstake","You've won the sweepstake",(new Date()));
			return res.send(winner.values)
		});
	}  

};
