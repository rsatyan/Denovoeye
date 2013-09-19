/*---------------------
	:: Appointment 
	-> controller
---------------------*/

var scheduler = require('../services/scheduler');
var dateUtil = require('../utilities/date-util')

var AppointmentController = {

	create : function (req,res) {

		console.log(req.param('startdate'))

		var date = new Date(req.param('startdate'))
		var enddate = new Date(req.param('enddate'))
		
		var userstartDate = dateUtil.convertDateToUserTimezone(date,req.user.timeZoneOffset)
		var userendDate = dateUtil.convertDateToUserTimezone(enddate,req.user.timeZoneOffset)

		var notification = "daily"
		if (req.param('notification')) notification = req.param('notification')

		Appointment.create({
			user_id : req.user.id.toString(),
			description : req.param('description'),
			date : userstartDate,
			notification : notification,
			timezone : dateUtil.userTimeZoneShortenedString(req.user.timeZoneString),
			active   : true,
			enddate : userendDate
		}).done (function(err, appointment){

			if (err) return res.send(err);
			res.send(appointment.values);
			scheduler.scheduleAppointment(appointment);
			return;

		}) ;

	},

	cancelAppointmentForUser : function (req,res) {

		Appointment.update({id:req.param('id')},{"active":false},function(err,appointment){

			if (err) return res.send(err);
			return res.send(appointment.values);

		});
	},

	index : function (req,res) {
			return res.view({user : req.user.values});
	},

	findAll : function (req,res) {

		Appointment.findAll({user_id:req.user.id.toString()}).done(function(err,appointments){
			if (err) return res.send(err);
			return res.send(global._.pluck(appointments,'values'));
		});
	}

};
module.exports = AppointmentController;
