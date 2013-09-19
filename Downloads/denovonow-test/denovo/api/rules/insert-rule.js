
/*
Rule for validating restrictions based on insert for card
*/

var validateForYear = function (entryNo,tracker,cb) {

	console.log("Insert - validateForYear");

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

	console.log("this year from "+thisYearStart+", to "+thisYearEnd);

	Timeline.findAll({
		userId : tracker.userID,
		questionId : tracker.questionID
	}).done(function(err, events) {

		if (err) return cb(true);

		if (events.length < entryNo && entryNo > 0) return cb(true);

		var count = 0;

		for (var i=0; i < events.length; i++) {
			var timelineEvent = events[i];
			if (timelineEvent.timestamp >= thisYearStart.getTime() && timelineEvent.timestamp <= thisYearEnd.getTime()) {
				count++
			}
		}

		if (count < entryNo) return cb(true)

		return cb(false);

	});

}

var validateForMonth = function (entryNo,tracker,cb) {

	console.log("Insert - validateForMonth");

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

		if (events.length < entryNo && entryNo > 0) return cb(true);

		var count = 0;

		for (var i=0; i < events.length; i++) {
			var timelineEvent = events[i];
			if (timelineEvent.timestamp >= thisMonthStart.getTime() && timelineEvent.timestamp <= thisMonthEnd.getTime()) {
				count++
			}
		}

		if (count < entryNo) return cb(true)

		return cb(false);

	});

}


var validateForDate = function (entryNo,tracker,cb) {

	console.log("Insert - validateForDate");

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

		if (events.length < entryNo && entryNo > 0) return cb(true);

		var count = 0;

		for (var i=0; i < events.length; i++) {
			var timelineEvent = events[i];
			if (timelineEvent.timestamp >= actualdateStart.getTime() && timelineEvent.timestamp <= actualdateEnd.getTime()) {
				count++
			}
		}

		if (count < entryNo) return cb(true)

		return cb(false);

	});
	
}

var validateForWeek = function (entryNo,tracker,cb) {

	console.log("Insert - validateForWeek");

	
	var now = new Date()
	var n = now.getDay();

	var weekstart = new Date();
	weekstart.setDate(now.getDate() - n);
	weekstart.setHours(0,0,0,0);

	Timeline.findAll({
		userId : tracker.userID,
		questionId : tracker.questionID
	}).done(function(err, events) {

		if (err) return cb(true);

		if (events.length < entryNo && entryNo > 0) return cb(true);

		var count = 0;

		for (var i=0; i < events.length; i++) {
			var timelineEvent = events[i];
			if (timelineEvent.timestamp >= timestamp) {
				count++
			}
		}

		if (count < entryNo) return cb(true)

		return cb(false);

	});

}


var Mapduration = {
	'week' : validateForWeek,
	'month' : validateForMonth,
	'day'  : validateForDate,
	'year' : validateForYear
}

exports.validate = function(entryNo,duration,tracker,cb) {

	console.log('insert rule - validate')
	return Mapduration[duration](entryNo,tracker,cb);

}