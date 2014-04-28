// models/response.js

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
    Survey = require('./survey.js').schema,
    Participant = require('./participant.js').schema;

var ResponseSchema = new Schema({
	survey_id: { type: ObjectId, ref: 'Survey' },
	participant_id: { type: ObjectId, ref: 'Participant' },
	date: { type: Date, default: Date.now },
	answers: [ String ]
});

module.exports = mongoose.model('Response', ResponseSchema);

