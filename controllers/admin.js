var Survey = require('../models/survey');
var Question = require('../models/question');

/* Survey Controller */
exports.newSurvey = function(req,res) {
	res.render('survey_form', {header: 'New Survey'});
};

exports.listSurveys = function(req,res) {
	Survey.find(function(err,surveys) {
		if (err) {
			res.send("You've encountered an error.");
		} else {
			res.render('admin_surveys', {header: 'Surveys', surveys: surveys});
		}
	});
};

exports.showSurvey = function(req,res) {
	Survey.findById(req.params.id, function(err,survey) {
		if (err) {
			res.send("Survey doesn't exist.");
		} else {
			res.render('admin_survey',{header: survey.name+' Survey', survey: survey});
		}
	});
};

/* Question Controller */
exports.newQuestion = function(req,res) {
	res.render('question_form', {header: 'New Question'});
};

exports.listQuestions = function(req,res) {
	Question.find(function(err,questions) {
		if (err) {
			res.send("You've encountered an error.");
		} else {
			res.render('admin_questions', {header: 'Questions', questions: questions});
		}
	});
};