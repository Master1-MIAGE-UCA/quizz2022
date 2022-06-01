function processParams (req, res, next) {
  req.popularity = req.query.popularity || 400000;

  console.log(req.query.genres);
  console.log(typeof req.query.genres);

  req.genres = req.query.genres ? req.query.genres.includes(',') ? req.query.genres.split(',') : req.query.genres : null;

  req.minDate = req.query.minDate || '1';

  req.maxDate = req.query.maxDate || '9999';

  next();
}

module.exports = processParams;
