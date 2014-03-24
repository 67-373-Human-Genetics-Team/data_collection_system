var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var QuestionSchema = new Schema({
	type: String,
	query: String,
	q_options: [String]
});

module.exports = mongoose.model('Question', QuestionSchema);