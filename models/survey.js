var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId
    Question = require('./question.js').schema;

var SurveySchema = new Schema({
	name: String,
	status: String,
	questions: [Question],
	responses: [ObjectId]
});

module.exports = mongoose.model('Survey', SurveySchema);

