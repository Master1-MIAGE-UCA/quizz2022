const Genre = require('../../bin/generator/db/Genre');

async function findGenres (req, res, next) {
  const genres = await Genre.find();

  res.locals.genres = genres.map(e => e.name).sort();

  next();
}

module.exports = findGenres;
