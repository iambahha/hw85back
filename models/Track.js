const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TrackSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  track_number: String,
  title: {
    type: String,
    require: true
  },
  album: {
    type: Schema.Types.ObjectId,
    ref: 'Album',
    required: true,
  },
  time: String,
  published: {
    type: Boolean,
    required: true,
    default: false
  },
  removed: {
    type: Boolean,
    required: true,
    default: false
  },
});

const Track = mongoose.model('Track', TrackSchema);

module.exports = Track;