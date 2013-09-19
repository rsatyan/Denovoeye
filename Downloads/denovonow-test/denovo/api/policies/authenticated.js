/**
* Allow any authenticated user.
*/
module.exports = function (req,res,ok) {
	
	// User is allowed, proceed to controller
	var sessionToken = req.headers['sessiontoken']
	var oauth = req.headers['authorization'];

	if (req.isAuthenticated()) {
		req.session.mobile = false;
		return ok();
	} else if (oauth) {

		var token = oauth.replace("OAuth2.0 ","");

		Accesstokens.find({
			access_token : token
		}).done(function(err,token){

			if (err) return res.send(err);
			req.session.mobile = false;
			return ok();

		});
	// User is not allowed
	} else if (sessionToken){

		SessionToken.find({token:sessionToken}).done(function(err,token){

			if (err) return res.send({"success":false,"message":err});

			if (!token) return res.send({"success":false,"message":"No/Invalid Token. Please login again"});

			if (token) {
				req.session.userid = token.userID
				req.session.mobile = true;

				return ok()
			}
		});

	}else {
		//return res.send("You are not permitted to perform this action.",403);
		return res.redirect('/login');
	}
};
