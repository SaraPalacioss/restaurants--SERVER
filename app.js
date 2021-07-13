require('dotenv').config();

const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');
const express       = require('express');
const favicon       = require('serve-favicon');
const logger        = require('morgan');
const session       = require('express-session');
const path          = require('path');
const cors          = require('cors');
const cookieSession = require('cookie-session');
const connectDB     = require('./config/db');
const app = express();

connectDB();
require('./config/auth');


const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);





app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.use(
  cors({
    credentials: true,
    origin: [`http://localhost:${process.env.PORT2}`],
  })
);


app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});


app.set('trust proxy', 1)
app.use(cookieSession({
    name:'session',
    keys: ['key1', 'key2'],
    sameSite: 'none',
    secure: true
}))

app.use(session ({
    secret: `oursecret`,
    resave: true,
    saveUninitialized: true,
    cookie: {
        sameSite: 'none',
        secure: true
    }
}))


app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(express.static('public'));  
app.use('/images', express.static('images')); 


const index = require('./routes/index');
app.use('/', index);


module.exports = app;
