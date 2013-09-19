/*---------------------
	:: Provider
	-> model
---------------------*/
module.exports = {

	attributes	: {

		// Simple attribute:
		name: 'STRING',
		subtext  : 'STRING',
		phoneNumber: {
			type: 'STRING',
			defaultValue: '555-555-5555'
		},
		speciality : 'STRING',
		plan : 'STRING',
		location : 'STRING',
		imgurl : 'STRING',
	}

};