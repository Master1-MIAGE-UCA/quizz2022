const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');

// For quizz
const indexRouterQuizz = require('./routes/quizz/index');
const usersRouterQuizz = require('./routes/quizz/users');
const questionsRouter = require('./routes/quizz/questions');

// For generator
const indexRouterGen = require('./routes/generator/index');
const usersRouterGen = require('./routes/generator/users');
const apiRouter = require('./routes/generator/api');
const dbRouter = require('./routes/generator/db');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'), path.join(__dirname, 'views/quizz'), path.join(__dirname, 'views/generator'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false // true = .sass and false = .scss
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouterQuizz);
app.use('/quizzUsers', usersRouterQuizz);
app.use('/quizzQuestions', questionsRouter);

app.use('/generator', indexRouterGen);
app.use('/generatorUsers', usersRouterGen);
app.use('/api', apiRouter);
app.use('/db', dbRouter);

app.use('/javascripts/jquery', function (req, res, next) {
  res.sendFile(path.join(__dirname, '/node_modules/jquery/dist/jquery.min.js'));
});

app.get('/messages/Messages.js', function (req, res) {
  res.sendFile(path.join(__dirname, '/bin/quizz/classes/Messages.js'));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
