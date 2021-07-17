require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const cookieSession = require('cookie-session');
const passport = require('passport')
const mongoose     = require('mongoose');

const connectDB = require('./config/db');
const app = express();
const MongoStore = require('connect-mongo')(session);

connectDB();
require('./config/auth');

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));


app.use(
  cors({
    credentials: true,
    origin: [`http://localhost:3001`, `http://localhost:3001`],
  })
);


// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   if (req.method == "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
//     return res.status(200).json({});
//   }

//   next();
// });
// MDW SESSION


app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});


// app.set('trust proxy', 1)
// app.use(cookieSession({
//   name: 'session',
//   keys: ['key1', 'key2'],
//   sameSite: 'none',
//   secure: true
// }));


// app.use(session({
//   secret: `oursecret`,
//   resave: true,
//   saveUninitialized: true,
//   cookie: {
//     sameSite: 'none',
//     secure: true
//   }
// }));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 1000
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60
  })
}))

app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(express.static('public'));
app.use('/images', express.static('images'));


const index = require('./routes/index');
app.use('/', index);


module.exports = app;
