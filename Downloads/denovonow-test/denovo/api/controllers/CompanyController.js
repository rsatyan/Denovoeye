/*---------------------
	:: Company 
	-> controller
---------------------*/
var CompanyController = {

	subscribeToModule :  function (req, res) {

		Module.find({id:req.param('moduleid')}).done(function(err,module){

			if (err) return res.send(err);

			Company.find({id:req.param('company_id')}).done(function(err,company) {

				if (err) {
					return res.send(err);

				} else {

					// Found company. push module to company.modules
					var arr = null
					if (company.modules) {
						arr = company.modules;
					} else {
						arr = new Array();
					}

					arr.push(module.values);
					// Update company
					Company.update({id:company.id.toString()},{modules : arr},function (err, company) {
						if (err) {
							 res.send(err);
						} else {
							 res.send(company.values);
						}
					});

					// Add all questions for that modules into CompanyQuestions Collection
					Questions.findAll({module_id:module.id.toString()}).done(function(err,questions){

						if (err) return console.log(err);

						for (var i=0; i < questions.length; i++) {
							var question = questions[i]

							Companyquestions.create({
								companyID : company.id.toString(),
								moduleID : module.id.toString(),
								questionID : question.id.toString(),
								Question : question.values,
								cardType : question.cardType,
								moduleName : module.name,
								level : Number(question.level)
							}).done(function(err,item){
								if (err) console.log(err);
								console.log(item.values);

							});
						}

					});

					return;

				}
			});
		});
	},

	subscribeToSweepStake : function (req,res) {

		CompanySweepstake.find({
			companyID : req.param('company_id'),
			sweepstakeID : req.param('sweepstakeID')
		}).done(function(err,cSweepstake) {

			if (err) return res.send(err);

			if (cSweepstake) return res.send(cSweepstake.values);

			// Create a new sweepstake for company
			Sweepstake.find({id:req.param('sweepstakeID')}).done(function(err,sweepstake){

				if (err) return res.send(err);

				if (!sweepstake) return res.send({"errNo" : 12012,"message" : "sweepstake not found"})

				CompanySweepstake.create({
					companyID : req.param('company_id'),
					sweepstakeID : sweepstake.id.toString(),
					sweepStake : sweepstake.values
				}).done(function(err,cSweepstake){

					if (err) return res.send(err);

					if (!cSweepstake) return res.send({"errNo" : 12013,"message" : "error while subscribing to sweepstake"})

					return res.send(cSweepstake.values)

				})

			})
			
		});

	}
};
module.exports = CompanyController;