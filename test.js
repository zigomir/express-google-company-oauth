var express = require('express')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var dotenv = require('dotenv')
var companyAuth = require('./index')

var app = express()
dotenv.config()

var config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  CALLBACK_URL: 'http://localhost:3000/auth/google/callback', // whole url
  CHECK: function (profile) {
    // optional
    return profile._json.domain === 'example.com' &&
      profile.emails[0].value !== 'test@example.com'
  },
  DOMAIN: 'example.com', // if CHECK above not set will only compare to "example.com"
  AUTH_PATH: '/auth/google',
  CALLBACK_PATH: '/auth/google/callback',
  SUCCESS_CALLBACK_PATH: '/',
  FAILURE_CALLBACK_PATH: '/401',
  SCOPE: 'https://www.googleapis.com/auth/plus.profile.emails.read'
}

app.use(
  session({
    secret: 'cool dawg',
    resave: false,
    saveUninitialized: true
  })
)
app.use(cookieParser())
companyAuth(app, config)

app.get('/', auth, function (req, res) {
  res.send('Hello World, Google user!')
})

app.get('/401', function (req, res) {
  res.send("Don't let me in!")
})

app.listen(3000, function () {
  console.log('Running on http://localhost:3000')
})

function auth (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/auth/google')
}
