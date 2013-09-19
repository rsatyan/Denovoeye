/*
Randomly choose sweepstake winner  user / company from all tickets purchased.
Create an entry for the user in the winners table
Send an email to company admin asking for confirmation
*/
var mailer = require('./mailer')

exports.chooseWinner = function(sweepstake,companylist) {

	for (var  i=0; i < companylist.length; i++) {

		var companyID  = companylist[i]
		Ticket.findAll({
			companyID : companyID,
			sweepstakeID : sweepstake.id.toString()
		}).done(function(err,tickets){

			if (err) {
				console.log(err)
			} else if (tickets.length == 0) {
				console.log("no tickets for sweepstake = "+sweepstake.id.toString())
			} else {

				// get random winner
				var randomIndex = Math.floor((Math.random()*tickets.length)+1);
				var winnerTicket = tickets[randomIndex]

				Sweepstakewinner.create({
					userID : winnerTicket.userId,
				  	userEmail : winnerTicket.useremail,
				  	ticketID : winnerTicket.id.toString(),
				  	sweepstakeID  : sweepstake.id.toString(),
				  	companyID : winnerTicket.companyID,
				  	confirmed : false,
				  	sweepstake : sweepstake
				}).done(function(err,winnerentry){

					if (err) {
						console.log(err)
					} else {
						// Send email to company admin
						Company.find({id:winnerTicket.companyID}).done(function(err,company){

							if (err) {
								console.log(err)
							} else {
								console.log(winnerentry.values)
								
								var subject = "Reminder about confirming Sweepstake Winner";
								var htmlbody = [ '<p>Welcome to <b>Denovonow</b></p><br/>',"Please visit the admin panel to confirm sweepstake winner"].join("");
								var user = {
									email : company.admin
								}
								mailer.sendMail(user,subject,htmlbody);
							}
						})
						
					}
				})

			}
		})
	}

}