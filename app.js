let createError = require('http-errors'),
    express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    session = require('express-session'),
    User = require('./model/Users');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var feedRouter = require('./routes/feed');
var uploadsRouter = require('./routes/uploads');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'm3894fj98d2d309'}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/feed', feedRouter);
app.use('/uploads', uploadsRouter);

app.use(function (req, res, next) {
  req.session.message = req.session.message || { error: [], success: [], info: [] };
  app.locals.message  = req.session.message;
 })

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
