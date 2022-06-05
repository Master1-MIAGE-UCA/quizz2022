const express = require('express');
const findGenres = require('../../middlewares/generator/findGenres');
const router = express.Router();
const got = require('got');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('generator/index.html.twig', { title: 'Express' });
});

router.get('/db', findGenres, function (req, res, next) {
  res.render('generator/indexdb.html.twig');
});

module.exports = router;
