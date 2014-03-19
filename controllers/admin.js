var Survey = require('../models/survey');

exports.newsurvey = function(req,res) {
	res.render('survey_form', {header: 'New Survey'});
};

exports.list = function(req,res) {
	Survey.find(function(err,surveys) {
		if (err) {
			res.send("You've encountered an error.");
		} else {
			var names = [];
			for (var i=0; i<surveys.length; i++) {
				names.push(surveys[i].name);
			}
            console.log(names);
			res.render('surveys', {header: 'Surveys', surveys: surveys});
		}
	});
};