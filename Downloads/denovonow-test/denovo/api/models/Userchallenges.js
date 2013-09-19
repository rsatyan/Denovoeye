/*---------------------
	:: Userchallenges
	-> model
---------------------*/
module.exports = {

	attributes	: {

		userID : 'STRING',
		challengeId : 'STRING',
		endDate: 'DATE',
   		startDate: 'DATE',
   		done: {
      		default: false,
      		type: 'BOOLEAN'
   		},
		timeZone:'STRING',
		challenge : 'OBJECT',

	}

};