const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // res.send(file);
  res.render('quizz/questions');
});

module.exports = router;
