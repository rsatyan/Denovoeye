/*
Utility methods to modify date
Currently sets date passed to previous month and previous week
*/

exports.setToPreviousMonth =  function (today){
	var thisMonth = today.getMonth();
	today.setMonth(thisMonth-1);
	if(today.getMonth() != thisMonth-1 && (today.getMonth() != 11 || (today == 11 && today.getDate() == 1)))
	today.setDate(0);
}

exports.setToPreviousWeek = function (today) {
	var n = today.getDay();
	today.setDate(today.getDate() - n);
	today.setHours(0,0,0,0);
}

exports.totalTrackedDays = function(date) {
	var now = new Date(); 
	var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
	var date_utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
	var diff = (now_utc.getTime() - date_utc.getTime()) / (24*60*60*1000)
	return Math.floor(diff);
}

exports.diffInDays = function(date1,date2) {
	var date1_utc = new Date(date1.getUTCFullYear(), date1.getUTCMonth(), date1.getUTCDate(),  date1.getUTCHours(), date1.getUTCMinutes(), date1.getUTCSeconds());
	var date2_utc = new Date(date2.getUTCFullYear(), date2.getUTCMonth(), date2.getUTCDate(),  date2.getUTCHours(), date2.getUTCMinutes(), date2.getUTCSeconds());
	var diff = (date2_utc.getTime() - date1_utc.getTime()) / (24*60*60*1000)
	return Math.floor(diff); 
}

exports.daysInMonth = function(year,month) {
	var day = new Date(year,month+1,0);
	return day.getDate();
}

exports.convertDateToUserTimezone = function(date,timezoneoffset) {
	var utc = new Date(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate(),date.getUTCHours(),date.getUTCMinutes(),date.getUTCSeconds(),date.getUTCMilliseconds());
	var userDate = new Date()
	userDate.setTime(utc.getTime() + (timezoneoffset * 60 * 1000))
	return userDate
}

exports.userTimeZoneShortenedString = function(timezonestring) {
	var tzArray = timezonestring.split(" ")
	return tzArray[(tzArray.length-1)]
}