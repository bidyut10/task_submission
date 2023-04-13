const express = require("express");
const passport = require("passport");
const session = require("express-session");
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
require("dotenv").config();
const app = express();

app.use(
  session({
    secret: process.env.LINKEDIN_CLIENT_SECRET_KEY,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/linkedin/callback",
      scope: ["r_emailaddress", "r_liteprofile"],
    },
    (accessToken, refreshToken, profile, done) => {
      profile.accessToken = accessToken;
      return done(null, profile);
    }
  )
);


app.get("/", (req, res) => {
  res.send(
    '<div style="text-align: center; padding-top: 250px;"><a href="/auth/linkedin" style="font-size: 30px;">Login with LinkedIn</a></div>'
  );
});

app.get("/auth/linkedin", passport.authenticate("linkedin"));

app.get(
  "/auth/linkedin/callback",
  passport.authenticate("linkedin", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

app.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user;
    // console.log(user)
    res.send(`
      <img src="${user.photos[0].value}"/>
      <p>User Name: ${user.displayName}</p>
      <p>User emailId: ${user.emails[0].value}</p>
      <pre>User Data: ${JSON.stringify(user._json, null, 2)}</pre>
    `);
  } else {
    res.redirect("/");
  }
});

app.listen(3001, () => {
  console.log("Server started on http://localhost:3001");
});
