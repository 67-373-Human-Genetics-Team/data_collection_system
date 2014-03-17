var mongoose = require('mongoose'),
	Schema = mongoose.Schema
	ObjectId = Schema.ObjectId;

var SurveySchema = new Schema({
	name: String,
	status: String,
	questions: [ObjectId],
	responses: [ObjectId]
});

module.exports = mongoose.model('Survey', SurveySchema);

