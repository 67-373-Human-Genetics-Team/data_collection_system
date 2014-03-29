var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId
    Question = require('./question.js').schema;

var SurveySchema = new Schema({
	name: String,
	status: String,
    created_at: {type: Date, default: Date.now},
    start_date: Date,
    end_date: Date,
	questions: [Question],
	responses: [ObjectId]
});

module.exports = mongoose.model('Survey', SurveySchema);

