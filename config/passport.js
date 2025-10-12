const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
const { signUser } = require("../utils/jwt");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Find or create user
          let user = await User.findOne({ email: profile.emails[0].value });
          if (!user) {
            user = await User.create({
              email: profile.emails[0].value,
              username: profile.displayName,
              password: "googleoauth", // placeholder password
              role: "user",
            });
          }
          done(null, user);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );
};
