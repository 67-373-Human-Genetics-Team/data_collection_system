var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var ResponseSchema = new Schema({
	survey_id: ObjectId,
	participant_id: ObjectId,
	date: {type: Date, default: Date.now},
	answers: [String],
    completed: {type: Boolean, default: false}
});

module.exports = mongoose.model('Response', ResponseSchema);

