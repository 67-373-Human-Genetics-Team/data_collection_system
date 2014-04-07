var Survey = require('../models/survey');
var Question = require('../models/question');
var Response = require('../models/response');
var Participant = require('../models/participant');
var dateFormat = require('dateformat');

/* Survey Controller */
exports.newSurvey = function(req,res) {
	res.render('survey_form', {header: 'New Survey'});
};

exports.listSurveys = function(req,res) {
	Survey.find(function(err,surveys) {
		if (err) {
			res.send("You've encountered an error.");
		} else {
			res.render('admin_listsurveys', {header: 'Surveys', surveys: surveys, dateFormat: dateFormat});
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

exports.listResponses = function(req,res) {
	Response.find(function(err,responses) {
		if (err) {
			res.send("You've encountered an error.");
		} else {
			res.render('admin_listResponses', {header: 'Responses', responses: responses, dateFormat: dateFormat});
		}
	});
};

exports.listParticipants = function(req,res) {
	Participant.find(function(err,participants) {
		if (err) {
			res.send("You've encountered an error.");
		} else {
			res.render('admin_listParticipants', {header: 'Participants', participants: participants});
		}
	});
};