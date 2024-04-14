import mongoose from "mongoose";
import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "passport";

import "./authStrategy/googleAuth.js";

const { DB_HOST, PORT = 3000, EXPRESS_SESSION_SECRET } = process.env;
const app = express();
app.use(express.json());
app.use(
  session({
    secret: EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

const isLoggedIn = (req, res, next) => {
  req.user ? next() : res.redirect("/failure"); //res.sendStatus(401);
};
mongoose
  .connect(DB_HOST)
  .then(
    () => app.listen(PORT),
    console.log(`Database connection successful. API on Port: ${PORT}`)
  )
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("<a href='/auth/google'>Login with Google</a>");
});

app.get("/protected", isLoggedIn, (req, res) => {
  res.send(`<h1>Hello, ${req.user.displayName}</h1>
    </br> <a href='/logout'>Logout...</a>`);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
app.get("/failure", (req, res) => {
  res.send(
    "<h1>You are not authorized!</h1> </br> <a href='/auth/google'>Login with Google</a>"
  );
});
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/failure",
  })
);

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/"); //send("Goodbye!");
  });
});
