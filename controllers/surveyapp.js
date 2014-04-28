var Survey = require('../models/survey');


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

exports.welcome = function(req,res) {
    Survey.findById(req.params.id, function(err,survey) {
        if (err) {
            res.send(err);
        } else {
            res.render('welcome', { survey: survey });
        }
    });
}

exports.begin = function(req,res) {
    Survey.findById(req.params.id, function(err,survey) {
        if (err) {
            res.send(err);
        } else {
            res.render('begin', { survey: survey });
        }
    });
}

exports.thankyou = function(req,res) {
    res.render('thankyou');
}