const express= require('express')
const passport = require('passport');
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const app=express()
require("dotenv").config();

passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    callbackURL: process.env.MICROSOFT_CALLBACK_URL,
    scope: ['user.read']
},
    function (accessToken, refreshToken, profile, done) {
        try {
            done(null, profile);
        } catch (err) {
            done(err, null);
        }
    }
));

app.get('/auth/microsoft', passport.authenticate('microsoft'));

app.get('/auth/microsoft/callback',
    passport.authenticate('microsoft', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    });


app.get('/protected', ensureAuthenticated, function (req, res) {
    res.send('Access Denied');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.listen(3000, () => {
    console.log("Server started on 3000");
});