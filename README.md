# google company domain oauth for express

> uses `passport` and `passport-google-oauth` and checks if user's email belongs to the domain

## Config

```js
var express = require('express')
var companyAuth = require('express-google-company-oauth')
var app = express()

var config = {
  CLIENT_ID: process.env.CLIENT_ID, // use dotenv or similar to populate ENV variables
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  CALLBACK_URL: 'http://localhost:3000/auth/google/callback', // whole url
  CHECK: function (profile) {
    // optional
    return profile._json.domain === 'example.com' &&
      profile.emails[0].value !== 'test@example.com' // filter out specific emails
  },
  DOMAIN: 'example.com', // if CHECK above not set will only compare to "example.com"
  AUTH_PATH: '/auth/google',
  CALLBACK_PATH: '/auth/google/callback',
  SUCCESS_CALLBACK_PATH: '/',
  FAILURE_CALLBACK_PATH: '/401',
  SCOPE: 'email' // optional
}

companyAuth(app, config)
```

There is another dependency (`express-session`) – for working example see [test.js](test.js).
