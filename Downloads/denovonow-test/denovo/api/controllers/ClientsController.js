/*---------------------
	:: Clients 
	-> controller
---------------------*/
var utils = require('../utilities/utils');

var ClientsController = {
	
	create : function (req,res) {

		var consumersecret = utils.uid(64);

		Clients.create({
			name : req.param('name'),
			secret : consumersecret
		}).done(function(err,client){

			if (err) res.send(err);
			return res.send(client.values);
		});

	}
};

module.exports = ClientsController;