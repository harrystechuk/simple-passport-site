// Requiring Modules
const express = require('express');
var expressLayouts = require('express-ejs-layouts');
const app = express();
const passport = require('passport');
const bodyParser = require('body-parser'); // parser middleware
const session = require('express-session');  // session middleware
const UserDetails = require('./userDetails');
const routes = require('./routes/router');
require('dotenv').config();

// set up view engine and layout
app.set('view engine', 'ejs');

// Set up session
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Set up passport
app.use(session({
  secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

// Configure More Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy
const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(UserDetails.authenticate()));

// To use with sessions
passport.serializeUser(UserDetails.serializeUser());
passport.deserializeUser(UserDetails.deserializeUser());


app.use(express.static('public'))

app.use(routes);
// GET Routes

const PORT = process.env.PORT || 3000;

// Set up express server
const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
