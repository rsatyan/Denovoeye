/*---------------------
	:: Profile 
	-> controller
---------------------*/
var ProfileController = {

	index : function(req,res){
		return res.view({user:req.user.values});
	}

};
module.exports = ProfileController;