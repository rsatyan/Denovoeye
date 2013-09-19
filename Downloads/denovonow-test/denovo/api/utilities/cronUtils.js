/*
Return cron time pattern from date object and notification
*/

exports.cronformat = function (date,notification) {

	var format = new Array();

	format.push(date.getSeconds().toString())
	format.push(date.getMinutes().toString())
	format.push(date.getHours().toString())
	format.push(date.getDate().toString())
	format.push(date.getMonth().toString())
	format.push(date.getDay().toString())

	// values for notification =  once,hourly, weekday, weekends, daily, monthly
	return getActualCronFormat(format,notification)
}

// cron format 

function getActualCronFormat(arr,notification) {

	if (notification === "once") {
		// Do nothing
	} else if (notification === "every minute") {

		arr[1] = "*";
		arr[2] = "*";
		arr[3] = "*";
		arr[4] = "*";
		arr[5] = "*";

	}else if (notification === "hourly") {
		// change 3rd index to *
		arr[2] = "*";
		arr[3] = "*";
		arr[4] = "*";
		arr[5] = "*";

	} else if (notification === "weekday") {
		arr[5] = "1-5"
	} else if (notification === "weekends") {
		arr[5] = "6,0"
	} else if (notification === "daily") {
		arr[5] = "0-6"
	} else if (notification === "monthly") {
		arr[4] = "*"
	}
	return arr.join(" ");
}