const mongoose = require('mongoose');
const Schema = require("mongoose");

const AlbumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: 'artist',
    required: true,
  },
  yearOfIssue: {
    type: Number,
    required: true,
  },
  image: String,
});

const Album = mongoose.model('Album', AlbumSchema);

module.exports = Album;