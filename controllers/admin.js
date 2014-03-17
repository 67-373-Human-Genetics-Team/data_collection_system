var Survey = require('../models/survey');

exports.newsurvey = function(req,res) {
	res.render('survey_form');
};

exports.list = function(req,res) {
	Survey.find(function(err,surveys) {
		if (err) {
			res.send("You've encountered an error.");
		} else {
			var names = [];
			for (var i=0; i<surveys.length; i++) {
				names.push(surveys.name);
			}
			res.render('surveys', {header: 'Surveys', names : names})
		}
	});
};