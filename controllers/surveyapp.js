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