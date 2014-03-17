var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ParticipantSchema = new Schema({
	first_name: String,
	last_name: String,
	email: String
});

module.exports = mongoose.model('Participant', ParticipantSchema);

