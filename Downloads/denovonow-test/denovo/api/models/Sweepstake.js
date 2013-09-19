/*---------------------
	:: Sweepstake
	-> model
---------------------*/
module.exports = {

	attributes	: {
		description  : 'STRING',
		cost : 'NUMBER',
		endDate : 'DATE',
		active : {
			type : 'BOOLEAN',
			default : true
		},
		imgurl : 'STRING'
	}

};