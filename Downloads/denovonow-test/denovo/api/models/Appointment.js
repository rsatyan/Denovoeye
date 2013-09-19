/*---------------------
	:: Appointment
	-> model
---------------------*/
module.exports = {

	attributes	: {

		user_id : 'INTEGER',
		description : 'STRING',
		date : 'DATE',
		enddate : 'DATE',
		active : {
			default : true,
			type : 'BOOLEAN'
		},
		notification: {
      		default: "once",
      		type: 'STRING'
   		},
   		timezone:'STRING',
	}

};