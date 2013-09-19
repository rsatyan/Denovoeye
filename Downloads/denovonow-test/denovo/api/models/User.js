/*---------------------
	:: User
	-> model
---------------------*/
module.exports = {

	attributes	: {
		
		company_id: 'STRING',
		company_name : 'STRING',
		firstname : 'STRING',
		lastname : 'STRING',
		user_level: 'INTEGER',
		displayimg : 'STRING',
		activated : 'STRING',
		restricted: 'INTEGER',
		username: 'STRING',
		name: 'STRING',
		phone: 'STRING',
		email: 'STRING',
		password: 'STRING',
		provider: 'STRING',
		provideruid : 'STRING',
		loginAttempts : 'INTEGER',
		lockUntil : 'INTEGER',
		rewardpoints : {
			type  : 'NUMBER',
			default : 0
		},
		pointsDonated : {
			type  : 'NUMBER',
			default : 0
		},
		challengesCompleted : {
			type : 'NUMBER',
			default : 0
		},
		timeZoneString : 'STRING',
		timeZoneOffset : 'NUMBER'
	}

};
