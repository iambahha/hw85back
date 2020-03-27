const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    require: true,
  },
  photo: String,
  description: String,
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

const Artist = mongoose.model('Artist', ArtistSchema);

module.exports = Artist;