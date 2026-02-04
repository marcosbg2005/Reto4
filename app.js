var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
var expressSession = require('express-session');

var indexRouter = require('./routes/index');

var app = express();

// Configuración de vistas (EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesión
app.use(expressSession({
  secret: 'clave-secreta-reto4',
  resave: false,
  saveUninitialized: true
}));

app.use('/', indexRouter);

// Manejo de errores 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Manejador de errores
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error'); 
});

module.exports = app;