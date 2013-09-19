/**
 * UserquestionsController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */

  index : function(req,res) {

  	var userid = (req.session.mobile)?req.session.userid : req.user.id.toString();
  	console.log("user id = "+userid)

  	Userquestions.findAll({userID:userid}).done(function(err,questions){

  		if (err) return res.send(err)

  		return res.send(questions);

  	});

  }
  

};
