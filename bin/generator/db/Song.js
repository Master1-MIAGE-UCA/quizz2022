const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: mongoose.Types.ObjectId,
    ref: 'Artist'
  },
  album: {
    type: mongoose.Types.ObjectId,
    ref: 'Album'
  },
  releaseDate: {
    type: String
  }
});

const Song = mongoose.model('Song', SongSchema);

module.exports = Song;
