/*---------------------
	:: Oauth2 
	-> controller
---------------------*/

var utils = require('../utilities/utils');
var Authorizationcodes = require('../models/Authorizationcodes');

global.clients = {};

var Oauth2Controller = {

	initiateOAuth2 :  function (req,res) {

		if (req.param('response_type') !== 'code') return res.send("wrong response type");

		Clients.find(req.param('client_id')).done(function(err, client) {
      				if (err) return res.send(err);

      				global.clients[req.sessionID] = {
      					clientID : client.id.toString(),
      					clientSecret : client.secret,
      					redirectURI  : req.param('redirect_url'),
      					response_type : req.param('response_type')
      				}

      				if(req.isAuthenticated()) {
      					return res.render('dialog', { user: req.user, client: client });
      				} else {
						res.redirect("/login");

					}
      				
    		});
			
	},

	grantToken : function (req,res) {

		// post request with client_id,client_secret,authorization code,redirect_uri, grant_type is received
		// return  oauth2.token;

		if (req.body.grant_type !== 'authorization_code') return res.send("wrong grant type");

		if (req.body.code){

			Authorizationcodes.find(req.body.code,function(err,authorizationcode){

    			if (err) return res.send(err);

    			if (req.body.client_id !== authorizationcode.clientID) return res.send("wrong client id");

				Clients.find(req.param('client_id')).done(function(err, client) {

					if (err) return res.send(err);
					if (req.body.client_secret !== client.secret) return res.send("wrong consumer secret");

					var token = utils.uid(256)

    				Accesstokens.create({
      					access_token : token,
      					user_id : authorizationcode.userID,
      					client_id: authorizationcode.clientID
    				}).done(function(err,accesstoken){
      					if (err) return done(err);

      					Authorizationcodes.remove(req.body.code,function(err){

      						if (err) console.log(err);

      						console.log("code deleted");

      					})

      					delete authorizationcode;

      					var response = {
      						id : "https://localhost:1337/user/"+req.user.id.toString(),
      						issued_at: accesstoken.createdAt,
      						instance_url: "https://localhost:1337",
      						access_token: accesstoken.access_token
      					};

						res.json(response);
      				});

				});
  			});
		} else {
			res.send("pass access code in request");
		}
	},

	decision : function (req,res) {

		if (req.body.approve) {
			var accesscode = utils.uid(16)

			Authorizationcodes.save(accesscode, global.clients[req.sessionID].clientID, global.clients[req.sessionID].redirectURI, req.user.id.toString(), function(err){
				if (err) return res.send(err);
				
				res.redirect(global.clients[req.sessionID].redirectURI+"?code="+accesscode);

				delete global.clients[req.sessionID];
				return;

			})
		} else {
			return res.send("Permission denied to access user's resources");
		}

	}

};
module.exports = Oauth2Controller;