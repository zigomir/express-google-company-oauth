var passport = require('passport')
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

module.exports = function init (app, config) {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.serializeUser((user, done) => done(null, user))
  passport.deserializeUser((user, done) => done(null, user))

  passport.use(
    new GoogleStrategy(
      {
        clientID: config.CLIENT_ID,
        clientSecret: config.CLIENT_SECRET,
        callbackURL: config.CALLBACK_URL
      },
      function (accessToken, refreshToken, profile, done) {
        if (
          (config.CHECK &&
            config.CHECK instanceof Function &&
            config.CHECK(profile)) ||
          profile._json.domain === config.DOMAIN
        ) {
          return done(null, profile)
        } else {
          return done(null, false)
        }
      }
    )
  )

  app.get(
    config.AUTH_PATH,
    passport.authenticate('google', {
      scope: config.SCOPE ||
        'https://www.googleapis.com/auth/plus.profile.emails.read'
    })
  )

  app.get(
    config.CALLBACK_PATH,
    passport.authenticate('google', {
      successRedirect: config.SUCCESS_CALLBACK_PATH,
      failureRedirect: config.FAILURE_CALLBACK_PATH
    })
  )
}
