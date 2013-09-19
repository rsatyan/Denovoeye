/*---------------------
	:: Questions 
	-> controller
---------------------*/
var rm = require('../rules/RulesMapper')

var QuestionsController = {

	create : function (req,res) {
		
		Questions.create({
			"module_id" : req.param('module_id'),
			"description" : req.param('desc'),
			"level" : req.param('level'),
			"options" : req.param('opt'),
			"rule" : req.param('rule'),
			"cardType" : req.param('cardType')
		}).done(function(err,question){

			if (err) return res.send(err);

			console.log(question.values)

			res.send(question.values);

			// Update the company Questions collection if module is present
			Companyquestions.findAll({
				moduleID : req.body.module_id
			}).done(function(err,collection){

				if (err) return console.log(err);

				for (var i = 0; i < collection.length; i++) {
					var companyq = collection[i];

					Companyquestions.create({
						companyID : companyq.companyID,
						moduleID : req.param('module_id'),
						questionID : question.id.toString(),
						Question : question.values,
					}).done(function(err,item){
						if (err) console.log(err);
						console.log(item.values);
					});
				}

				return;

			});
			
		});

	},

	update : function(req,res) {

		var body = req.body;

		Questions.update({
		  	id:req.param('id')
		},{
			"description" : body.desc,
			"level" : body.level,
			"options" : body.opt,
			"rule" : req.body.rule
		}, function(err, question) {
		  // Error handling
		  if (err) return console.log(err);
		  // Updated question successfully!
		    res.send(question.values);

		    Companyquestions.update({
		    	questionID : question.id.toString()
		    },{
		    	Question   : question.values
		    }, function(err,companyquestion){

		    	if (err) return console.log(err);
		    	return console.log(companyquestion);
		    });

		});

	},

	destroy : function(req,res) {

		// remove question entry from company questions table
		Companyquestions.destroy({
			  questionID : req.param('id')
		},function(err) {
			  // Error handling
			  if (err) {
			     console.log(err);

			  } else {
			    console.log("Companyquestions deleted");
			  }
		});

		// remove question from questions collection
		Questions.destroy({
			  id : req.param('id')
		},function(err) {
			  // Error handling
			  if (err) return res.send(err);

			  return res.send("question deleted");
		});

	},

	getQuestionsByModuleId :  function (req,res) {

		Questions.findAllByModule_id(req.param('module_id')).done(function(err,questions){
			if (err) return res.send(err);
			return res.send(global._.pluck(questions,'values'));
		});

	},

	checkRule : function(req,res) {

		Questions.find({id:req.param('id')}).done(function(err,question){
			if (err || !question) return res.send(err);

			return res.send({"success":rm.Map(question.rule,question.id.toString())});
		});

		
	}

};
module.exports = QuestionsController;