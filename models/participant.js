var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ParticipantSchema = new Schema({
	first_name: String,
	last_name: String,
	email: String,
    available_surveys: [ObjectId],
    completed_surveys: [ObjectId]
});

module.exports = mongoose.model('Participant', ParticipantSchema);

