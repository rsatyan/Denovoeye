/*---------------------
	:: Auth 
	-> controller
---------------------*/

var passport = require('passport'),
	mailer = require('../services/mailer'),
	bcrypt = require('bcrypt-nodejs'),
	utils = require('../utilities/utils')
	
var logTimeStamp = function (userid,ip) {

	LoginTimestamps.create({
					user_id : userid,
					ip      : ip
				}).done(function (err, loginTimestamps){
					
					if (err){
						console.log(err);
					}
	});

};

var redirectClient = function(req,res) {


	if (global.clients[req.sessionID]) {
		// var redirectURL = "/oauth2/authorize?response_type="+req.session.oauth2.response_type+"&client_id="+req.session.oauth2.client.id+"&redirect_url="+req.session.oauth2.redirectURI;
		var redirectURL = "/oauth2/authorize?response_type="+global.clients[req.sessionID].response_type+"&client_id="+global.clients[req.sessionID].clientID+"&redirect_url="+global.clients[req.sessionID].redirectURI;
		return res.redirect(redirectURL);
	} else {
		return res.redirect('/home');
	}

}

var toPasswordlessObject = function(obj) {
	var newObj = obj;
	delete newObj.password
	return newObj;
}

var createNewSession = function(user,cb){

	var accesscode = utils.uid(16)

	SessionToken.create({
		token : accesscode,
  		userID : user.id.toString(),
	}).done(function(err,sessionToken){

		if (err) return cb(err,null);

		if (!sessionToken) return cb("Unexpected Error, Please try again",null)

		return cb(null,sessionToken.token)

	});
}

var AuthController = {
	
	index : function (req,res) {
		if (req.isAuthenticated()) {
			return res.redirect('/home');
		} else {
			return res.view();
		}
	},

	signupform : function (req,res) {
		res.view();
	},

	confirm : function (req,res) {		
		
		User.update({id : req.param("id")}, {
				"activated":"Y"
			},function(err, user) {
			// Error handling
			
			console.log("confirmed user = "+JSON.stringify(user));

  			if (err) { 
  				return res.send(err)
  			}else {
  				// res.send("You have succesfully activated your account, please <a href='/login'>Login</a>  and continue using denovonow.");
  				res.redirect("/login")
  			}
		});
	},

	signup : function ( req,res)  {

		User.findByEmail(req.param("username")).done(function (err,user) {

			if (err || !user) {
				// No such user found
				var hash = bcrypt.hashSync(req.param("password"));

				User.create({
					provider: 'local',
					email:req.param("username"),
					name:req.param("name"),
					activated:"N",
					username:req.param("username"),
					password:hash,
					loginAttempts:0,
					lockUntil:5,
					user_level : 1,
					rewardpoints : 0,
					challengesCompleted : 0,
					pointsDonated : 0
				}).done(function(err, user) {
					if (err) return res.send({"success":false,"message":err});
					
					// setup e-mail data with unicode symbols
					var htmlbody = [ '<p>Welcome to <b>Denovonow</b></p><br/>',
                        		'To confirm your registration please click the link below<br/>',
                        		'http://'+req.headers.host+'/auth/confirm/' + user.id.toString() ].join(" ")

					mailer.sendMail(user,"Confirm your registration at denovonow",htmlbody);

					return res.send({"success":true,"message":"Please check your email for account confirmation"})

				});

			} else {
				res.send ({"success": false,"message" : "This username is already in use. Please use a different email id to sign up"});
			}

		});

	},

	activate : function (req,res) {
		//User.update({id:req.param})
	},

	logout : function (req,res) {
		req.logout();
		res.redirect("/");
	},

	local : function (req,res) {

		passport.authenticate('local',function(err,user,info) {
			if((err) || (!user)) {
				res.redirect('/login');
				return;
			}
			
			req.logIn(user, function(err)
			{
				if (err){
					res.view();
					return;
				}

				logTimeStamp(user.id,req.connection.remoteAddress);
				
				return redirectClient(req,res);
			});
		})(req, res);
	},

	applogin : function(req,res) {

		User.find({"username":req.param("username")}).done(function (err,user) {

			if (err) return res.send({"success":false,"message":err});

			if (!user) return res.send({"success":false,"message":"No/Invalid email/username"});

			if (!bcrypt.compareSync(req.param('password'), user.password)) return res.send({"success":false,"message":"Wrong username/password"});
			
			createNewSession(user,function(err,token){

				if (err) return res.send({"success":false,"message":err});

				return res.send({"success":true,"sessionToken":token,"user":utils.toJson(user.values,"password")})
			})
			
		});
	},

	facebooklogin : function(req,res) {

		var user = JSON.parse(req.param('fbUser'));

		User.find({provideruid:user['id']}, function (err, user) {
        
        	if (err) return res.send({"success":false,"message":err})

            if (user) {
            	createNewSession(user,function(err,token){

					if (err) return res.send({"success":false,"message":err});

					return res.send({"success":true,"sessionToken":token,"user":utils.toJson(user.values,"password")})
				})
            } else {

            	User.create({
                    provider     : "facebook",
                    provideruid  : user['id'],
                    name         : user['name'],
                    firstname    : user.first_name,
                    lastname	 : user.last_name,
                    username 	 : user.username,
                    activated    : "Y",
                    user_level   :1,
                    rewardpoints : 0,
                    challengesCompleted : 0,
                    pointsDonated : 0
	             }).done(function (err, user) {
	                if (err) return res.send({"success":false,"message":err})

	               	createNewSession(user,function(err,token){

						if (err) return res.send({"success":false,"message":err});

						return res.send({"success":true,"sessionToken":token,"user":utils.toJson(user.values,"password")})
					})

	            });
            }
        })

	},

	twitterlogin  :function(req,res) {

		var user = JSON.parse(req.param('twUser'));


		User.find({provideruid:user['id_str']}, function (err, existingUser) {
        
        	if (err) return res.send({"success":false,"message":err})

            if (existingUser) {

            	createNewSession(user,function(err,token){

					if (err) return res.send({"success":false,"message":err});
 
 					return res.send({"success":true,"sessionToken":token,"user":utils.toJson(existingUser.values,"password")})
				})
            } else {

            	var names = user['name'].split(" ")

            	var firstname = names[0]
            	var lastname = names[1]


            	User.create({
                    provider     : "twitter",
                    provideruid  : user['id_str'],
                    name         : user['name'],
                    firstname    : user.first_name,
                    lastname	 : user.last_name,
                    username 	 : user['screen_name'],
                    displayimg	 : user['profile_image_url'],
                    activated    : "Y",
                    user_level   :1,
                    rewardpoints : 0,
                    challengesCompleted : 0,
                    pointsDonated : 0
	             }).done(function (err, newUser) {


	                if (err) return res.send({"success":false,"message":err})


	               	createNewSession(user,function(err,token){

						if (err) return res.send({"success":false,"message":err});

						return res.send({"success":true,"sessionToken":token,"user":utils.toJson(newUser.values,"password")})
					})

	            });
            }
        })
	},

	appLogout : function(req,res) {

		SessionToken.destroy({
		  token : req.get('sessionToken')
		}).done(function(err) {

		  // Error handling
		  if (err) {
		    return res.send({"success":false,"message":err});

		  // Johnny was deleted!  
		  } else {
		    return res.send({"success":true})
		  }
		});

	},

	twitter : function(req,res) {
		passport.authenticate('twitter', 
				{ failureRedirect: '/login'}, function (err,user) {
				req.logIn(user,function(err) {
					if(err) {
						res.view();
						return;
					}

					logTimeStamp(user.id,req.connection.remoteAddress);

					// res.redirect('/home');
					// return;
					return redirectClient(req,res);
					
				});
		})(req,res);
	},

	'twitter/callback' : function(req,res) {
		 passport.authenticate('twitter',{ failureRedirect: '/login' },
       		     function (req, res) {
       		         res.redirect('/home');
         })(req, res);	
	},

	facebook :  function(req,res) {
		
		passport.authenticate('facebook', 
				{ failureRedirect: '/login', 
				  scope: ['user_status', 'user_checkins']
				}, function (err,user) {


				req.logIn(user,function(err) {
					if(err) {
						console.log(err);
						res.view();
						return;
					}

					logTimeStamp(user.id,req.connection.remoteAddress);

					// return res.redirect('/home');
					return redirectClient(req,res);
									
				});
		})(req,res);

	},

	'facebook/callback': function (req, res) {
		 passport.authenticate('facebook',{ failureRedirect: '/login' },
       		     function (req, res) {
       		     	console.log("facebook/callback redirect to home");
       		         res.redirect('/home');
         })(req, res);	
	},

	google : function(req,res) {

		passport.authenticate('google', 
				{ failureRedirect: '/login', 
				  scope:['https://www.googleapis.com/auth/plus.login',
					 'https://www.googleapis.com/auth/userinfo.profile'] 
				}, function (err,user) {
				req.logIn(user,function(err) {
					if(err) {
						res.view();
						return;
					} 

					logTimeStamp(user.id,req.connection.remoteAddress);

					return redirectClient(req,res);
				});
		})(req,res);
		
	},

	
    'google/callback': function (req, res) {
       		 passport.authenticate('google',{ failureRedirect: '/login' },
       		     function (req, res) {
       		         res.redirect('/home');
       		     })(req, res);
    },


    'fitbit' : function(req,res) {

		passport.authenticate('fitbit', 
				{ failureRedirect: '/login'}, function (err,user) {
				req.logIn(user,function(err) {
					if(err) {
						res.view();
						return;
					} 

					logTimeStamp(user.id,req.connection.remoteAddress);
					return redirectClient(req,res);

				});
		})(req,res);
		
	},

	'fitbit/callback': function (req, res) {
       		 passport.authenticate('fitbit',{ failureRedirect: '/login' },
       		     function (req, res) {
       		         res.redirect('/home');
       		     })(req, res);
    },

    doAdminLogin : function (req,res) {

    	passport.authenticate('local',function(err,user,info) {
    		
			if((err) || (!user)) {
				console.log(err);
				res.redirect('/admin-login');
				return;
			}
			
			req.logIn(user, function(err)
			{
				if (err){
					res.view();
					return;
				}

				logTimeStamp(user.id,req.connection.remoteAddress);

				return redirectClient(req,res);
			});
		})(req, res);
    },

    adminLogin : function (req,res) {

    	if (req.user) return res.redirect('/home');

    	var action = "/auth/admin/login/done";
    	// return res.send('<html><head></head><body><form action="'+action+'" method="post"><div><label>Username:</label><input type="text" name="username"/></div><div><label>Password:</label><input type="password" name="password"/></div><div><input type="submit" value="Log In"/></div></form></body></html>');
    	return res.view({action:action});
    }


};
module.exports = AuthController;
