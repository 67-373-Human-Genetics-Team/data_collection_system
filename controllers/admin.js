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
			res.render('admin_survey',{ header: survey.name+' Survey', survey: survey });
		}
	});
};

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

exports.listSurveyMetrics = function(req,res) {
	Survey
		.findById(req.params.id)
		.populate('responses')
		.exec(function (err, survey) {
			if (err) {
				res.send(err);
			} else {
				res.render('admin_surveyMetrics', { survey: survey });
				console.log('Listing Survey Responses:');
				console.log('	'+survey.responses);
			}
		});
};

exports.listSurveyParticipants = function(req,res) {
	Response
		.find({ survey_id: req.params.id })
		.populate('participant_id')
		.exec(function (err,responses) {
			if (err) {
				res.send(err);
			} else {
				res.render('admin_surveyParticipants', { responses: responses });
				console.log(responses);
			}
		});
};

// listSurveyResponses
exports.showSurveyResponse = function(req,res) {
	Response
		.findById(req.params.response_id)
		.populate('survey_id')
		.populate('participant_id')
		.exec(function (err, response) {
			if (err) {
				res.send(err)
			} else {
				res.render('admin_surveyResponse', { response: response });
				console.log(response);
			}
		});
}

exports.listResponses = function(req,res) {
	Response
		.find()
		.populate('survey_id')
		.populate('participant_id')
		.exec(function (err, responses) {
			if (err) {
				res.send(err);
			} else {
				res.render('admin_listResponses', { header: 'Responses', responses: responses, dateFormat: dateFormat });
			}
		});
};

exports.showResponse = function(req,res) {
    Response
        .findById(req.params.id)
        .populate('survey_id')
        .populate('participant_id')
        .exec(function (err, response) {
        	if (err) {
        		res.send(err);
        	} else {
	          	res.render('admin_response', { response: response, dateFormat: dateFormat });
	            
	            console.log('The response belongs to %s', response.survey_id.name);
	            // prints "The response belongs to 2014 Graduation"

	            console.log('The survey status is %s', response.survey_id.status);
	            // prints "The survey status is Published'

	            console.log('The participant\'s email is %s', response.participant_id.email);
	            // prints "The participant's email is gw@example.com"
        	}
    	});
};