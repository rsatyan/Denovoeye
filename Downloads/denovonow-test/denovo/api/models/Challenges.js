/*---------------------
	:: Challenges
	-> model
---------------------*/
module.exports = {

	attributes	: {

      title : {
            default: "Empty Title",
            type: 'STRING'
      },
		description: {
      		default: "Empty Challenge",
      		type: 'STRING'
   	},

      notification: {
            default: "daily",
            type: 'STRING'
      },
      imgURL : 'STRING',
      duration : 'NUMBER',
	}

};