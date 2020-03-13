const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TrackSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	number: {
		type: Number,
		required: true
	},
	album: {
		type: Schema.Types.ObjectId,
		ref: 'Album'
	},
	duration: String,
});

const Track = mongoose.model('Track', TrackSchema);

module.exports = Track;