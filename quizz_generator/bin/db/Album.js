const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: mongoose.Types.ObjectId,
    ref: 'Artist'
  },
  songs: {
    type: [mongoose.Types.ObjectId],
    ref: 'Song'
  },
  releaseDate: {
    type: String
  }
});

const Album = mongoose.model('Album', AlbumSchema);

module.exports = Album;
