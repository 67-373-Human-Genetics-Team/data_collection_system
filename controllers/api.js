var Survey = require('../models/survey');

// Retrieve survey by ID
exports.get = function(req,res) {
    Survey.findById(req.params.id, function(err,survey) {
        if (err) {
            res.send(err);
        } else {
            res.send(survey);
            console.log(survey);
        }
    });
};

// Create new survey
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

// Delete survey by ID
exports.delete = function(req,res) {
    Survey.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.send(err);
        } else {
            res.send('Deleted');
        }
    });
};