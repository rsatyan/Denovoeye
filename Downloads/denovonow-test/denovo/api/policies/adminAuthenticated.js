/**
* Allow only admin authenticated user.
*/
module.exports = function (req,res,ok) {
	
	// User is allowed, proceed to controller
	if (req.user) {
		if(req.user.username === global.CONFIG.Admin.USERNAME) {
			return ok();
		} else {
			return res.send("You are not permitted to perform this action.",403);
		}
	} 

	// User is not allowed
	else {
		return res.send("You are not permitted to perform this action.",403);
	}
};