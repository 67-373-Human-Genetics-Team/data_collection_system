var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var QuestionSchema = new Schema({
    query: String,
	type: String,
	query_options: [String]
});

module.exports = mongoose.model('Question', QuestionSchema);