// api.js
// API controller for models' CRUD functionality



// Models =================================================
var Survey = require('../models/survey');
var Question = require('../models/question');
var Response = require('../models/response');
var Participant = require('../models/participant');



// Survey API =============================================
// Retrieve survey by ID
exports.getSurvey = function(req,res) {
    Survey.findById(req.params.id, function(err,survey) {
        if (err) {
            res.send(err);
        } else {
            res.send(survey);
        }
    });
};

// Create new survey
exports.postSurvey = function(req,res) {
    if (req.body.name === "") {
        res.send('Please provide a name for the survey.');
    } else {
        new Survey({name: req.body.name, status: req.body.status}).save(
        function (err,survey) {
            if (err) { 
                res.send(err);
            } else {
                res.writeHead(302, {
                    'Location': '/admin/surveys/'+survey._id
                });
                res.end();
            }
        });
    }
};

// Publish survey makes survey available to public
exports.publishSurvey = function(req,res) {
    Survey.findById(req.params.id, 
        function (err,survey){
            if (err) {
                res.send(err);
            } else {
                survey.status = "Published";
                survey.start_date = Date.now();
                survey.save();
                res.send('You\'ve successfully published this survey. Participants can now submit their responses.');
            }
        });
};

// Close survey makes survey unavailable
exports.closeSurvey = function(req,res) {
    Survey.findById(req.params.id,
        function (err,survey) {
            if (err) {
                res.send(err);
            } else {
                survey.status = "Closed";
                survey.end_date = Date.now();
                survey.save();
                res.send('You\'ve successfully closed this survey. There will be no more responses added.');
            }
        });
};

// Delete survey by ID
exports.deleteSurvey = function(req,res) {
    Survey.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.send(err);
        } else {
            res.send('Deleted survey.');
        }
    });
};



// Question API ===========================================
// Add question to survey
exports.postQuestion = function(req,res) {
    if (req.body.query === "" || req.body.type === "") {
        res.send("Error no question");
    } else if ((req.body.type === "Checkbox" || req.body.type === "Multiple Choice" || req.body.type === "Dropdown") && (req.body.options.length < 1)) {
        res.send("Error no options");
    } else {
        var question = new Question({query: req.body.query, type: req.body.type, query_options: req.body.options.split("::")});
        Survey.findById(req.body.id, 
            function (err,survey) {
                if (err) {
                    res.send(err);
                } else {
                    survey.questions.push(question);
                    survey.save();
                    res.send(question);
                    console.log(survey);
                }
            });
    }
};


// Delete question in survey by ID
exports.deleteQuestion = function(req,res) {
    var question_id = req.params.question_id;
    Survey.findById(req.params.survey_id, 
        function (err,survey) {
            if (err) {
                res.send(err);
            } else {
                for (var i=0; i < survey.questions.length; i++) {
                    if (survey.questions[i]._id == question_id) {
                        survey.questions.splice(i,1);
                    }
                }
                survey.save();
                res.send('Deleted question successfully.');
            }
        });
};



// Response API ===========================================
// Add response to survey
exports.postResponse = function(req,res) {
    var response;
    var answers = req.body.answers.split("::");
    var questions;

    console.log("POST Response: ");
    console.log("There are "+answers.length+" answers");

    response = new Response({
        survey_id: req.body.survey_id,
        answers: req.body.answers.split("::"),
        participant_id: req.body.participant_id
    });

    Survey.findById(req.body.survey_id, function (err,survey) {
        if (err) {
            res.send(err);
        } else {
            questions = survey.questions;
            console.log("There are "+questions.length+" questions");
            if (answers.length != questions.length) {
                res.send("Error missing answers");
            } else {
                response.save(function (err,response) {
                    if (err) {
                        res.send(err);
                    } else {
                        Survey.findById(req.body.survey_id, function (err,survey) {
                            if (err) {
                                res.send(err);
                            } else {
                                survey.responses.push(response._id);
                                survey.save();
                                console.log('Added response ID %s to survey', survey._id);
                            }
                        });
                        res.send("Submitted");
                    }
                });
            }
        }
    });
};

// Get response to survey
exports.getResponse = function(req,res) {
    Response.findById(req.params.id, function (err,response) {
        if (err) {
            res.send(err);
        } else {
            res.send(response);
        }
    });
};

// Delete response
exports.deleteResponse = function(req,res) {
    console.log("Delete Response: ");
    console.log(req.body);
    Response.findById(req.params.id, function (err,response) {
        if (err) {
            res.send(err);
        } else {
            res.send(response);
            // res.send('Deleted response.');
        }
    });
};

// Delete response from survey by survey ID
exports.deleteResponseFromSurvey = function(req,res) {
    console.log("Delete Response from Survey: ");
    Survey.findById(req.params.survey_id, function (err,survey) {
        if (err) {
            res.send(err);
        } else {
            res.send(survey);
        }
    });
};



// Participant API ========================================
// Create new participant
exports.postParticipant = function(req,res) {

    var survey_id = req.body.survey_id;

    if (req.body.first_name === "" || req.body.last_name === "" || req.body.email === "") {
        res.send('Error missing input');
    } else {
        new Participant({ first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, available_surveys: req.body.survey_id }).save(
            function (err,participant) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(participant);
                    console.log("Participant saved:");
                    console.log(participant);
                }
        });
    }
};

// Get participant
exports.getParticipant = function(req,res) {
    Participant.findById(req.params.id, function (err,participant) {
        if (err) {
            res.send(err);
        } else {
            res.send(participant);
        }
    });
};

// Update participant's survey completion status
exports.updateCompletedSurveys = function(req,res) {
    var survey_id = req.body.survey_id;
    Participant.findById(req.params.id, function (err,participant) {
        if (err) {
            res.send(err);
        } else {
            
            // Remove the completed survey id from array
            for (var i=0; i<participant.available_surveys.length; i++) {
                if (participant.available_surveys[i] === survey_id) {
                    participant.available_surveys.splice(i,1);
                    console.log('Available Surveys: '+participant.available_surveys);

                    // Add completed survey id to array of completed surveys
                    participant.completed_surveys.push(survey_id);
                    participant.save();
                    console.log('Completed Surveys: '+participant.completed_surveys);
                }
            }

            res.send('Updated participant\'s list of completed surveys.');
        }
    });
};

// Delete participant
exports.deleteParticipant = function(req,res) {
    Participant.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.send(err);
        } else {
            res.send('Deleted participant.');
        }
    });
};










