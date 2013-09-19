/*---------------------
	:: Notification 
	-> controller
---------------------*/
var NotificationController = {

	findAll : function (req,res) {

		Notification.findAll({
			userId:req.user.id.toString(),
			read : false
		}).sort('createdAt DESC').done(function(err,notifications){
			if (err) return res.send(err);
			return res.send(global._.pluck(notifications,'values'));
		});
	}

};
module.exports = NotificationController;