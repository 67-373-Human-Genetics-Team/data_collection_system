var Survey = require('../models/survey');

exports.post = function(req,res) {
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