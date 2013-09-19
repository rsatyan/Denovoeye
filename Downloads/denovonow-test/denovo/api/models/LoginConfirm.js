/*---------------------
	:: LoginConfirm
	-> model
---------------------*/
module.exports = {

	attributes	: {

		// Simple attribute:
		// name: 'STRING',

		// Or for more flexibility:
		// phoneNumber: {
		//	type: 'STRING',
		//	defaultValue: '555-555-5555'
		// }

		data     : 'STRING',
		user_id  : 'INTEGER',
		email    : 'STRING',
		key      : 'STRING',
		type     : 'STRING',
	}

};