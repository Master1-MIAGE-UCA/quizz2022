const express = require('express');
const findGenres = require('../middlewares/findGenres');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index.html.twig', { title: 'Express' });
});

router.get('/db', findGenres, function (req, res, next) {
  res.render('indexdb.html.twig');
});

module.exports = router;
