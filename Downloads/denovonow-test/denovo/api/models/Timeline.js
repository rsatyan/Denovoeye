/*---------------------
	:: Timeline
	-> model
---------------------*/
module.exports = {

	attributes	: {

		questionId : 'STRING',
		moduleID : 'STRING',
		questionLevel : 'INTEGER',
		userId : 'STRING',
		Question : 'OBJECT',
		reward   : 'INTEGER',
		result : 'ARRAY',
		timestamp : 'NUMBER',
		rewardId : 'STRING',
		cardType : 'STRING'
	}

};