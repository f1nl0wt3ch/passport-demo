const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../../models/UserModel');
const bcrypt = require('bcryptjs');
const upperCase = require('upper-case');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Login Page
router.get('/login', (req, res) => res.render('users/loginView', {
    registered: req.query.registered || 0,
    errorArr: []
}));

// Login Post
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/users/dashboard',
        failureRedirect: '/users/login?registered=-1',
        failureFlash: 'Your username or password is incorrect',
        successFlash: 'Welcome to Dashboard'
    })(req, res, next);
});

passport.use(new LocalStrategy(
    (email, password, done) => {
        User.findOne({ email: email }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));

module.exports = router;