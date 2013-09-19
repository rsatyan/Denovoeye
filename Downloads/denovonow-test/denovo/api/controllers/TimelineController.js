/*---------------------
	:: Timeline 
	-> controller
---------------------*/
var TimelineController = {

	index : function(req,res) {

		Timeline.findAll({
			questionId : req.param('questionId'),
			userId : req.user.id.toString()
		}).sort('createdAt DESC').done(function(err,collection){

			if (err) return res.send(err);

			return res.view({
				user : req.user.values,
				timeline:collection
			});

		});
	}

};
module.exports = TimelineController;