// admin.js
// Admin controller for surveys, participants and responses



// Models =================================================
var Survey = require('../models/survey');
var Question = require('../models/question');
var Response = require('../models/response');
var Participant = require('../models/participant');
var dateFormat = require('dateformat'); 



// Survey Controller ======================================
// Create new survey
exports.newSurvey = function(req,res) {
	res.render('admin_surveyForm', { header: 'New Survey' });
};

// Get all surveys
exports.listSurveys = function(req,res) {
	Survey.find(function(err,surveys) {
		if (err) {
			res.send("You've encountered an error.");
		} else {
			res.render('admin_listsurveys', { header: 'Surveys', surveys: surveys, dateFormat: dateFormat });
		}
	});
};

// Get individual survey by survey ID
exports.showSurvey = function(req,res) {
	Survey.findById(req.params.id, function(err,survey) {
		if (err) {
			res.send("Survey doesn't exist.");
		} else {
			res.render('admin_survey',{ header: survey.name+' Survey', survey: survey });
		}
	});
};



// Participant Controller =================================
// Get all participants
exports.listParticipants = function(req,res) {
	Participant
		.find()
		.populate('available_surveys')
		.populate('completed_surveys')
		.exec(function (err, participants) {
			if (err) {
				res.send("You've encountered an error.");
			} else {
				res.render('admin_listParticipants', { header: 'Participants', participants: participants });
			}
		});
};

// Get individual participant by participant ID
exports.showParticipant = function(req,res) {
	Participant
		.findById(req.params.id)
		.populate('available_surveys')
		.populate('completed_surveys')
		.exec(function (err, participant) {
			if (err) {
				res.send(err);
			} else {
				res.render('admin_participant', { participant: participant, dateFormat: dateFormat });
				console.log(participant.available_surveys);
				console.log(participant.completed_surveys);
			}
		});
};



// Response Controller ====================================
// Get all responses for survey by survey ID
exports.listSurveyResponses = function(req,res) {
	Response
		.find({ survey_id: req.params.id })
		// Joins table
		.populate('participant_id')
		.populate('survey_id')
		.exec(function (err,responses) {
			if (err) {
				res.send(err);
			} else {
				res.render('admin_surveyResponses', { responses: responses });
			}
		});
};

// Get individual response for survey by response ID
exports.showSurveyResponse = function(req,res) {
	Response
		.findById(req.params.response_id)
		// Joins table
		.populate('survey_id')
		.populate('participant_id')
		.exec(function (err, response) {
			if (err) {
				res.send(err)
			} else {
				// Groups question with corresponding answer into an array
				var questions_answers = [];
				for (var i=0; i<response.answers.length; i++) {
					var group = [];
					group.push(response.survey_id.questions[i]);
					group.push(response.answers[i]);
					questions_answers.push(group);
				}
				console.log(questions_answers);
				res.render('admin_surveyResponse', { response: response, questions: response.survey_id.questions, answers: response.answers, questions_answers: questions_answers });
			}
		});
};