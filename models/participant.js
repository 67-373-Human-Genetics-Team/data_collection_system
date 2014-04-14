var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Survey = require('./survey.js').schema;

var ParticipantSchema = new Schema({
	first_name: String,
	last_name: String,
	email: String,
    available_surveys: [{ type: ObjectId, ref: 'Survey' }],
    completed_surveys: [{ type: ObjectId, ref: 'Survey' }]
});

module.exports = mongoose.model('Participant', ParticipantSchema);

