const mongoose = require('mongoose');

const ArtistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  birthDate: {
    type: String
  },
  deathDate: {
    type: String
  },
  deezerFans: {
    type: Number
  },
  genres: {
    type: [mongoose.Types.ObjectId],
    ref: 'Genre'
  }
});

const Artist = mongoose.model('Artist', ArtistSchema);

module.exports = Artist;
