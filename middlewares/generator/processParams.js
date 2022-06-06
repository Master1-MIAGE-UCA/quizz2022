function processParams(req, res, next) {
  req.difficulty = req.query.difficulty || "all";

  switch (req.difficulty) {
    case "all":
      req.popularityGt = req.query.popularity || 300000;
      break;
    case "easy":
      req.popularityGt = 6000000;
      break;
    case "medium":
      req.popularityLt = 6000000;
      req.popularityGt = 3000000;
      break;
    case "hard":
      req.popularityLt = 3000000;
  }

  console.log(req.query.genres);
  console.log(typeof req.query.genres);

  req.genres = req.query.genres ? req.query.genres.includes(',') ? req.query.genres.split(',') : req.query.genres : null;

  req.minDate = req.query.minDate || '1';

  req.maxDate = req.query.maxDate || '9999';

  next();
}

module.exports = processParams;
