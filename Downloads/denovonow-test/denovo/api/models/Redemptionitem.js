/*---------------------
	:: Redemptionitem
	-> model
---------------------*/
module.exports = {

	attributes	: {

		type : 'STRING',
		imageurl : 'STRING',
		title : 'STRING',
		description : 'STRING',
		points : 'NUMBER',
		contribution : {
			type : 'NUMBER',
			default : 0
		},
		url : 'STRING'
		
	}

};