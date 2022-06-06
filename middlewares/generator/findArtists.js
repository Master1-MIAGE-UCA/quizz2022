const Artist = require('../../bin/generator/db/Artist');
const Genre = require('../../bin/generator/db/Genre');
const shuffle = require('../../bin/generator/scripts/shuffle');

async function findArtists (req, res, next) {
  let filter;
  switch(req.difficulty){
    case "all" :
    case "easy" :
      filter = { deezerFans: { $gt: req.popularityGt }, birthDate: { $ne: null } };
      break;
    case "medium" :
      filter = { deezerFans: { $gt: req.popularityGt, $lt: req.popularityLt }, birthDate: { $ne: null } };
      break;
    case "hard" :
      filter = { deezerFans: { $lt: req.popularityLt }, birthDate: { $ne: null } };
  }

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
