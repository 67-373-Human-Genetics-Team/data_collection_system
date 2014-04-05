var Survey = require('../models/survey');

exports.home = function(req,res) {
	res.render('home');
};

exports.login = function(req,res) {
    res.render('login', {name: 'Login'});
}

exports.logout = function(req,res) {
    res.render('logout', {name: 'Logout'});
}

exports.surveys = function(req,res) {
    Survey.find(function(err,surveys) {
        if (err) {
            res.send("You've encountered an error.");
        } else {
            var names = [];
            for (var i=0; i<surveys.length; i++) {
                names.push(surveys[i].name);
            }
            console.log(names);
            res.render('surveys', {header: 'Surveys', surveys: surveys});
        }
    });
};

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