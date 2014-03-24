var Survey = require('../models/survey');
var Question = require('../models/question');

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
		function (err) {
			if (err) { 
				res.send(err);
			} else {
                res.writeHead(302, {
                    'Location': '/admin/surveys'
                });
                res.end();
			}
	});
};

// Delete survey by ID
exports.deleteSurvey = function(req,res) {
    Survey.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.send(err);
        } else {
            res.send('Deleted');
        }
    });
};

/* Question API */
// Create new question
// exports.postQuestion = function(req,res) {
//     new Question({query: req.body.query, type: req.body.types, q_options: req.body.options}).save(
//         function (err) {
//             if (err) {
//                 res.send(err);
//             } else {
//                 res.writeHead(302, {
//                     'Location': '/admin/questions'
//                 });
//                 res.end();
//             }
//     });
// }