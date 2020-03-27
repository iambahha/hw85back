const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    require: true
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: 'Artist',
    required: true,
  },
  date: String,
  image: String,
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

const Album = mongoose.model('Album', AlbumSchema);

module.exports = Album;