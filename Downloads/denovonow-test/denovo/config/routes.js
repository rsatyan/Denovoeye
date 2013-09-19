// Routes
// *********************
// 
// This table routes urls to controllers/actions.
//
// If the URL is not specified here, the default route for a URL is:  /:controller/:action/:id
// where :controller, :action, and the :id request parameter are derived from the url
//
// If :action is not specified, Sails will redirect to the appropriate action 
// based on the HTTP verb: (using REST/Backbone conventions)
//
//		GET:	/:controller/read/:id
//		POST:	/:controller/create
//		PUT:	/:controller/update/:id
//		DELETE:	/:controller/destroy/:id
//
// If the requested controller/action doesn't exist:
//   - if a view exists ( /views/:controller/:action.ejs ), Sails will render that view
//   - if no view exists, but a model exists, Sails will automatically generate a 
//       JSON API for the model which matches :controller.
//   - if no view OR model exists, Sails will respond with a 404.
//
module.exports.routes = {
	
	// To route the home page to the "index" action of the "home" controller:
	'/' : {
		controller	: 'home'
	},

	'auth/confirm/:id' : {
		controller  : 'auth',
		action      : 'confirm'
	},

	'post /signup' : {
		controller  : 'auth',
		action      : 'signup'
	},

	'/signup' : {
		controller  : 'auth',
		action      : 'signupform'
	},

	'post /login' : {
		controller  : 'auth',
		action      : 'local'
	},

	'post /auth/applogin' : {
		controller : 'auth',
		action : 'applogin'
	},

	'post /auth/facebook-login' : {
		controller : 'auth',
		action  : 'facebooklogin'
	},

	'post /auth/twitter-login' : {
		controller : 'auth',
		action : 'twitterlogin'
	},

	'/login': {
		controller	: 'auth',
		action		: 'index'
	},

	'/logout' : {
		controller	: 'auth',
		action		: 'logout'

	},

	'/mobile/logout' : {
		controller : 'auth',
		action : 'appLogout'
	},

	'get /admin-login' : {
		controller  : 'auth',
		action      : 'adminLogin'
	},

	'post /auth/admin/login/done' : {
		controller  : 'auth',
		action      : 'doAdminLogin'
	},

	// If you want to set up a route only for a particular HTTP method/verb 
	// (GET, POST, PUT, DELETE) you can specify the verb before the path:
	// 'post /signup': {
	//		controller	: 'user',
	//		action		: 'signup'
	// }

	// Keep in mind default routes exist for each of your controllers
	// So if you have a UserController with an action called "juggle" 
	// a route will be automatically exist mapping it to /user/juggle.
	//
	// Additionally, unless you override them, new controllers will have 
	// create(), find(), findAll(), update(), and destroy() actions, 
	// and routes will exist for them as follows:
	
	// Standard RESTful routing
	// (if index is not defined, findAll will be used)

	'get /user': {
		controller	: 'user',
		action      : 'index'
	},

	/*
	'get /user/:id': {
		controller	: 'user',
		action		: 'findByUserId'
	},

	'post /user': {
		controller	: 'user',
		action		: 'create'
	},
	'put /user/:id': {
		controller	: 'user',
		action		: 'update'
	},
	'delete /user/:id': {
		controller	: 'user',
		action		: 'destroy'
	}
	*/

	'put /user/:user_id/add/provider/:provider_id' : {
		controller : 'user',
		action     : 'addprovider',

	},

	'put /user/:user_id/add/company/:company_id' : {
		controller  : 'user',
		action      : 'addCompany'
	},

	'get /company/:id/user' : {
		controller  : 'user',
		action      : 'findUsersByCompanyId'
	},

	'put /company/:company_id/subscribe/module/:moduleid' : {
		controller  : 'company',
		action      : 'subscribeToModule'
	},

	'get /module/:module_id/questions' : {
		controller  : 'questions',
		action      : 'getQuestionsByModuleId'
	},

	'get /oauth2/authorize' : {
		controller  : 'oauth2',
		action      : 'initiateOAuth2'
	},

	'post /oauth2/token' : {
		controller  : 'oauth2',
		action      : 'grantToken'
	},

	'post /oauth2/decision' : {
		controller  : 'oauth2',
		action      : 'decision'
	},

	'put /appointment/:id/cancel' : {
		controller  : 'appointment',
		action      : 'cancelAppointmentForUser'
	},

	'put /userchallenges/:id/completed' : {
		controller  : 'userchallenges',
		action      : 'markChallengeAsCompleted'
	},

	'get /userappointments' : {
		controller  : 'appointment',
		action      : 'findAll'
	},

	'get /redeem/item/:item_id' : {
		controller  : 'redemptionitem',
		action      : 'redeemItem'
	},

	'get /user/:userId/questions' : {
		controller  : 'user',
		action      : 'getAllQuestionsForUser'
	},

	'get /userpoints' : {
		controller  : 'user',
		action 		: 'getStat'
	},

	'get /trackQuestion' : {
		controller  : 'trackresult',
		action 		: 'checkIfUserHasAnsweredQuestion'
	},

	'post /company/:company_id/subscribe/:sweepstakeID' : {
		controller 	: 'company',
		action     	: 'subscribeToSweepStake'
	},

	'get /ticket/count' : {
		controller 	: 'ticket',
		action  	: 'getCountOfTickets'
	},

	'put /updateLevel' : {
		controller 	: 'user',
		action 		: 'updateTrackerLevel'
	},

	'post /userchallenges/add/challenge/:challengeID' : {
		controller  : 'userchallenges',
		action 		: 'addChallenge'
	},

	'post /challengetracker' : {
		controller  : 'userchallenges',
		action 		: 'trackchallenge'
	},

	'get /trackresult/:questionID/daycount' : {
		controller 	: 'trackresult',
		action 		: 'getdayCountForQuestion'
	},

	'get /trackresult/:questionID/point' : {
		controller 	: 'trackresult',
		action 		: 'getPointForQuestion'
	},

	'get /challengetracker/:challengeID/daycount' : {
		controller 	: 'userchallenges',
		action 		: 'getdayCountForChallenge'
	},

	'put /user/update' : {
		controller 	: 'user',
		action 		: 'updateprofile'
	},

	'post /user/upload' : {
		controller 	: 'user',
		action 		: 'uploadDisplayImage' 
	},

	'get /profile' : {
		controller 	: 'profile',
		action 		: 'index'
	},

	'post /benefit/signup' : {
		controller 	: 'benefit',
		action 		: 'signup'
	},

	'put /benefittracker/:id/activate' : {
		controller 	: 'benefittracker',
		action 		: 'activeBenefit',
 	},

 	'put /sweepstakewinner/:id/activate' : {
 		controller 	: 'Sweepstakewinner',
 		action 		: 'confirmWinner'
 	}
};
