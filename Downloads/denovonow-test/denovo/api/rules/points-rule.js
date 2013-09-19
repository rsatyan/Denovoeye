/*
Rule for validating restrictions based on points for card
*/

var validateForYear = function (points,tracker,cb) {

	console.log("Points - validateForYear");


	var thisYearStart = new Date()
	thisYearStart.setTime(tracker.date);
	thisYearStart.setHours(0,0,0,0);
	thisYearStart.setDate(1);
	thisYearStart.setMonth(0);

	var thisYearEnd = new Date()
	thisYearEnd.setTime(tracker.date);
	thisYearEnd.setHours(23,59,59,999);
	thisYearEnd.setDate(31);
	thisYearEnd.setMonth(11);

	Timeline.findAll({
		userId : tracker.userID,
		questionId : tracker.questionID
	}).done(function(err, events) {

		if (err) return cb(true);

		if ((!events || events.length == 0) && tracker.point < points) return cb(true);

		var totalpoints = 0;

		for (var i = 0; i < events.length; i++) {
			var currentEvent = events[i]

			if (currentEvent.timestamp >= thisYearStart.getTime() && currentEvent.timestamp <= thisYearEnd.getTime()) {

				if ((currentEvent.reward + tracker.point) > points) return cb(false);

				totalpoints = totalpoints + currentEvent.reward;

				if ((totalpoints + tracker.point) > points) return cb(false);
				
			}
			
		}

		return cb(true);

	});

}

var validateForDate = function (points,tracker,cb) {

	console.log("Points - validateForDate");

	var actualdateStart = new Date();
	actualdateStart.setTime(tracker.date)
	actualdateStart.setHours(0,0,0,0);
	var actualdateEnd = new Date();
	actualdateEnd.setTime(tracker.date)
	actualdateEnd.setHours(23,59,59,999);

	console.log("check for date between = "+actualdateStart+", and = "+actualdateEnd)


	Timeline.findAll({
		userId : tracker.userID,
		questionId : tracker.questionID
	}).done(function(err, events) {

		if (err) return cb(true);

		if ((!events || events.length == 0) && tracker.point < points) return cb(true);

		var totalpoints = 0;

		for (var i = 0; i < events.length; i++) {
			var currentEvent = events[i]

			if (currentEvent.timestamp >= actualdateStart.getTime() && currentEvent.timestamp <= actualdateEnd.getTime()) {

				if ((currentEvent.reward + tracker.point) > points) return cb(false);

				totalpoints = totalpoints + currentEvent.reward;

				if ((totalpoints + tracker.point) > points) return cb(false);
				
			}
			
		}

		return cb(true);

	});

}

var validateForWeek = function (points,tracker,cb) {

	console.log("Points - validateForWeek");

	var now = new Date()
	var n = now.getDay();

	var weekstart = new Date();
	weekstart.setDate(now.getDate() - n);
	weekstart.setHours(0,0,0,0);

	var timestamp = weekstart.getTime()

	Timeline.findAll({
		userId : tracker.userID,
		questionId : tracker.questionID
	}).done(function(err, events) {

		if (err) return cb(true);

		if ((!events || events.length == 0) && tracker.point < points) return cb(true);

		var totalpoints = 0;

		for (var i = 0; i < events.length; i++) {
			var currentEvent = events[i]

			if (currentEvent.timestamp >= timestamp) {

				if ((currentEvent.reward + tracker.point) > points) return cb(false);

				totalpoints = totalpoints + currentEvent.reward;

				if ((totalpoints + tracker.point) > points) return cb(false);
				
			}
			
		}

		return cb(true);

	});

}

var validateForMonth = function(points,tracker,cb) {

	var month = [31,28,31,30,31,30,31,31,30,31,30,31]

	var thisMonthStart = new Date()
	thisMonthStart.setTime(tracker.date);
	thisMonthStart.setHours(0,0,0,0);
	thisMonthStart.setDate(1);

	var thisMonthEnd = new Date()
	thisMonthEnd(tracker.date)
	thisMonthEnd.setHours(23,59,59,999)
	thisMonthEnd.setDate(month[thisMonthEnd.getMonth()])

	console.log("this month from = "+thisMonthStart+", to "+thisMonthEnd);

	Timeline.findAll({
		userId : tracker.userID,
		questionId : tracker.questionID
	}).done(function(err, events) {

		if (err) return cb(true);

		if ((!events || events.length == 0) && tracker.point < points) return cb(true);

		var totalpoints = 0;

		for (var i = 0; i < events.length; i++) {
			var currentEvent = events[i]

			if (currentEvent.timestamp >= thisMonthStart.getTime() && currentEvent.timestamp <= thisMonthEnd.getTime()) {

				if ((currentEvent.reward + tracker.point) > points) return cb(false);

				totalpoints = totalpoints + currentEvent.reward;

				if ((totalpoints + tracker.point) > points) return cb(false);
				
			}
			
		}

		return cb(true);

	});

}


var Mapduration = {
	'week' : validateForWeek,
	'day'  : validateForDate,
	'month' : validateForMonth,
	'year' : validateForYear
}
//questionId,userId
exports.validate = function(points,duration,tracker,cb) {

	console.log('point rule - validate')

	return Mapduration[duration](points,tracker,cb);

}