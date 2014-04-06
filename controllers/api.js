var Survey = require('../models/survey');
var Question = require('../models/question');
var Response = require('../models/response');

/* Survey API */
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
};



// Publish survey
exports.publishSurvey = function(req,res) {
    Survey.findById(req.params.id, 
        function (err,survey){
            if (err) {
                res.send(err);
            } else {
                survey.status = "Published";
                survey.start_date = Date.now();
                survey.save();
                res.send('Published survey.');
                console.log(survey);
            }
        });
};

// Unpublish survey


// Close survey
exports.closeSurvey = function(req,res) {
    Survey.findById(req.params.id,
        function (err,survey) {
            if (err) {
                res.send(err);
            } else {
                survey.status = "Closed";
                survey.end_date = Date.now();
                survey.save();
                res.send('Closed survey.');
                console.log(survey);
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





/* Question API */
// Add question to survey
exports.postQuestion = function(req,res) {
    var question = new Question({query: req.body.query, type: req.body.type, query_options: req.body.options.split("::")});
    Survey.findById(req.body.id, 
        function (err,survey) {
            if (err) {
                res.send(err);
            } else {
                survey.questions.push(question);
                survey.save();
                res.redirect("/admin/surveys/"+survey._id);
                console.log(survey);
            }
        });
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
                res.send('Deleted question.');
            }
        });
};




/* Response API */
// Add response to survey
exports.postResponse = function(req,res) {
    new Response({ survey_id: req.body.survey_id, answers: req.body.answers, completed: req.body.completed }).save(
        function (err,reponse) {
            if (err) { 
                res.send(err);
            } else {
                res.writeHead(302, {
                    'Location': '/surveys'
                });
                res.end();
                console.log("Response posted");
            }
    });
}
