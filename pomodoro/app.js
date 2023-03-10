// Require env, get env's data
require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Using session
const session = require("express-session");
const mongoose = require('mongoose');
const mongoStore = require('connect-mongo');


var apiRouter = require('./routes/api');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var sessionRouter = require('./routes/session');
var friendRouter = require('./routes/friend');
var accountRouter = require('./routes/account');
var spotifyRouter = require('./routes/spotify');
var app = express();

//連線
mongoose.set("strictQuery", false);
//mongoose.connect('mongodb://127.0.0.1:27017/sessions');
mongoose.connect(process.env.mongodbUrl);
const db = mongoose.connection;
db.on('error', (error) => console.error('連線發生問題', error));
db.on('open', () => { console.log('DB連線成功') });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    name: 'mySessionID',
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: false,

    store: mongoStore.create({
        mongoUrl: process.env.mongodbUrl,
        collection: 'PomoClock',
        ttl: 24 * 60 * 60
    })
}))


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/spotify', spotifyRouter);
app.use('/session', sessionRouter);
app.use('/api', apiRouter);
app.use('/friend', friendRouter);
app.use('/account', accountRouter);
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


//Call API => Token
//Token => Cookie
//Headers =>Auth

//=> Token
//Token => html variable

//
