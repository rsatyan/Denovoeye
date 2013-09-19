
var insertRule = require('./insert-rule')
var pointRule = require('./points-rule')

var RuleMap = {

	'MAX_INSERT_RULE' : insertRule.validate,
	'MAX_POINT_RULE'  : pointRule.validate
}

var getRule = function(functionName) {

	var rule = functionName.substring(0,functionName.indexOf('('));

	console.log("Rule : "+rule);
	
	return rule;
}

var getArgList = function(functionName) {

	var argListstartIndex = functionName.indexOf('(') + 1;
	var argListEndIndex = functionName.indexOf(')');

	var args = functionName.substring(argListstartIndex,argListEndIndex)	
	var list = args.split(',');

	console.log(args);

	if (list.length != 2) throw new Error("Argument list for rule is either too long or too short")

	console.log("arg list : "+list);

	return list
}


exports.Map = function (evaluationString,tracker,cb) {

	var  eval = evaluationString.replace(' ', '');

	var andPattern = /(.+)AND(.+)/g;
	var orPattern = /(.+)OR(.+)/g;

	if (andPattern.test(eval)) {

		console.log('and eval pattern');

		var arr = eval.split('AND')

		var rule = (getRule(arr[0])).replace(' ', '');
		var args = getArgList(arr[0]);

		RuleMap[rule](args[0],args[1],tracker,function(result){

			if (result) {
				// First expression resulted in true, so evaluation second expression now.
				var rule1 = (getRule(arr[1])).replace(' ', '');
				var args1 = getArgList(arr[1]);

				RuleMap[rule1](args1[0],args1[1],tracker,function(result1){
					return cb(result1);
				})


			} else {
				return cb(false);
			}
		});


	} else if (orPattern.test(eval)) {

		console.log('or eval pattern');

		var arr = eval.split('OR')

		var rule = getRule(arr[0]);
		var args = getArgList(arr[0]);

		RuleMap[rule](args[0],args[1],tracker,function(result){

				// First expression resulted in true, so evaluation second expression now.
				var rule1 = (getRule(arr[1])).replace(' ', '');
				var args1 = getArgList(arr[1]);

				RuleMap[rule1](args1[0],args1[1],tracker,function(result1){
					return cb(result || result1);
				})
		});

	} else {

		console.log('single eval expression');
		var rule = (getRule(eval)).replace(' ', '');
		var args = getArgList(eval);
		return RuleMap[rule](args[0],args[1],tracker,cb);

	}

}