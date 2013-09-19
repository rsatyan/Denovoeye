/*---------------------
	:: Device 
	-> controller
---------------------*/
var DeviceController = {

	create :  function(req,res) {

		Device.find({
			deviceToken : req.param('deviceToken'),
			user_id : req.user.id.toString()
		}).done(function(err,device) {

			if (device) return res.send("device : "+device.deviceToken+" is already registered");

			Device.create({
				OS : req.param('OS'),
				deviceToken : req.param('deviceToken'),
				user_id : req.user.id.toString()
			}).done(function(err, device) {
				if (err) return res.send(err);
				return res.send(device.values);

			});

		});
	}

};
module.exports = DeviceController;