// surveyapp.js
// Public functionality for participants



// Models =================================================
var Survey = require('../models/survey');



// Controller =============================================
// Get survey by survey ID
exports.getSurvey = function(req,res){
    Survey.findById(req.params.id, function(err,survey) {
        if (err) {
            res.send(err);
        } else {
            res.render('survey', { survey: survey });
            console.log(survey);
        }
    });
};

// Display welcome screen
exports.welcome = function(req,res) {
    Survey.findById(req.params.id, function(err,survey) {
        if (err) {
            res.send(err);
        } else {
            res.render('welcome', { survey: survey });
        }
    });
}

// Display begin screen for participant form
exports.begin = function(req,res) {
    Survey.findById(req.params.id, function(err,survey) {
        if (err) {
            res.send(err);
        } else {
            res.render('begin', { survey: survey });
        }
    });
}

// Display thank you page after survey completed
exports.thankyou = function(req,res) {
    res.render('thankyou');
}