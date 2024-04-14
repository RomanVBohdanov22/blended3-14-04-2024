import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import passport from "passport";
import { User } from "../models/users.js";
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true,
    },
    (request, accessToken, refreshToken, profile, done) => {
      User.findOrCreate({ email: profile.email }, function (err, user) {
        return done(err, { ...user, displayName: profile.displayName });
      });
      console.log(profile);
    }
  )
);
//визначаємо, що зберегти в сесії
passport.serializeUser((user, done) => {
  done(null, user);
  console.log(user);
});
//визначаємо, що зберегти в req.user
passport.deserializeUser((user, done) => {
  done(null, user);
});
