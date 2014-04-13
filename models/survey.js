var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
    Question = require('./question.js').schema,
    Response = require('./response.js').schema;

var SurveySchema = new Schema({
	name: String,
	status: String,
    created_at: { type: Date, default: Date.now },
    start_date: Date,
    end_date: Date,
	questions: [ Question ],
	responses: [{ type: ObjectId, ref: 'Response' }]
});

module.exports = mongoose.model('Survey', SurveySchema);

