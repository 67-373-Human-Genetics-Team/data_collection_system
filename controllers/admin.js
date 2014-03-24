var Survey = require('../models/survey');
var Question = require('../models/question');

// Survey Controller
exports.newSurvey = function(req,res) {
	res.render('survey_form', {header: 'New Survey'});
};

exports.listSurveys = function(req,res) {
	Survey.find(function(err,surveys) {
		if (err) {
			res.send("You've encountered an error.");
		} else {
			var names = [];
			for (var i=0; i<surveys.length; i++) {
				names.push(surveys[i].name);
			}
            console.log(names);
			res.render('admin_surveys', {header: 'Surveys', surveys: surveys});
		}
	});
};

// Question Controller
exports.newQuestion = function(req,res) {
	res.render('question_form', {header: 'New Question'});
};

exports.listQuestions = function(req,res) {
	Question.find(function(err,questions) {
		if (err) {
			res.send("You've encountered an error.");
		} else {
			var queries = [];
			for (var i=0; i<questions.length; i++) {
				queries.push(questions[i].query);
			}
			console.log(queries);
			res.render('admin_questions', {header: 'Questions', questions: queries});
		}
	});
};