/*---------------------
	:: Notification
	-> model
---------------------*/
module.exports = {

	attributes	: {
		userId : 'STRING',
		message : 'STRING',
		type : 'STRING',
		date : 'STRING',
		sourceID : 'STRING',
		read : {
			type : 'BOOLEAN',
			default : false
		}
	}

};