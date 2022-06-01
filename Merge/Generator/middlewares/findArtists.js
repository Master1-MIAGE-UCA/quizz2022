const Artist = require('../bin/db/Artist');
const Genre = require('../bin/db/Genre');
const shuffle = require('../bin/scripts/shuffle');

async function findArtists (req, res, next) {
  const filter = { deezerFans: { $gt: req.popularity }, birthDate: { $ne: null } };
  if (req.genres) {
    const genres = (await Genre.find({ name: { $in: req.genres } })).map(e => e._id);

    filter.genres = { $in: genres };
  }

  const artistsBD = await Artist.find(filter);

  shuffle(artistsBD);

  req.artistsBD = artistsBD.filter(e => ((e.birthDate > req.minDate && e.birthDate < req.maxDate)));

  next();
}

module.exports = findArtists;
