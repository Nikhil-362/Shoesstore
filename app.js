var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const ownersRouter = require('./routes/adminRouter')
const productsRouter = require('./routes/productsRouter')
const usersRouter = require('./routes/usersRouter')
const home = require('./routes/homeRoter')
require('dotenv').config();
const session = require('express-session');
const flash = require('connect-flash');



const db = require("./config/mongoose-connection")


var app = express();

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
  }));
  
  app.use(flash());

  app.use((req, res, next) => {
    res.locals.errorMessage = req.flash('error');
    res.locals.successMessage = req.flash('success');
    next();
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', home);
app.use('/admin', ownersRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);


app.use((req, res, next) => {
  res.status(404).render('404', { title: '404 - Page Not Found' });
});

console.log("process.env.NODE_ENV", process.env.NODE_ENV);

module.exports = app;
