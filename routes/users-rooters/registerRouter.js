const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../../models/UserModel');
const bcrypt = require('bcryptjs');
const upperCase = require('upper-case');

// Register Page
router.get('/register', (req, res) => res.render('users/registerView', {
    passedObj: undefined
}));

// Register Post
router.post('/register', (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    let errorArr = [];
    // Check password match
    if (password != confirmPassword) {
        errorArr.push({ msg: '** Passwords do not match' });
    }
    if (password.length < 6) {
        errorArr.push({ msg: '** Password length must be at least 6 characters' });
    }
    if (errorArr.length == 0) {
        User.findOne({ email: upperCase(email) })
            .then(user => {
                // User exist
                if (user) {
                    errorArr.push({ msg: '** Email is already registerd' });
                    res.render('users/registerView', {
                        passedObj: {
                            errorArr,
                            firstName,
                            lastName,
                            email
                        }
                    });
                } else {
                    const newUser = new User({
                        firstName: upperCase(firstName),
                        lastName: upperCase(lastName),
                        email: upperCase(email),
                        password: password
                    });
                    // Hash password
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) {
                                console.log(err);
                                throw err;
                            } else {
                                console.log('Hashed ', hash);
                                newUser.password = hash;
                                console.log('newUser ', newUser);
                                newUser.save()
                                    .then(user => {
                                        console.log('Successfully saved user to database');
                                        res.redirect('/users/login?registered=1');
                                    })
                                    .catch(err => {
                                        errorArr.push({ msg: '** Could not process your request, please try again' });
                                        res.render('users/registerView', {
                                            passedObj: {
                                                errorArr,
                                                firstName,
                                                lastName,
                                                email
                                            }
                                        });
                                    });
                            }
                        }); // hash
                    }); // genSalt
                }
            })
            .catch(err => {
                console.log(err);
                errorArr.push({ msg: '** There was something wrong in your request, please try again' });
                res.render('users/registerView', {
                    passedObj: {
                        errorArr,
                        firstName,
                        lastName,
                        email
                    }
                });
            })
    } else {
        res.render('users/registerView', {
            passedObj: {
                errorArr: errorArr,
                firstName: firstName,
                lastName: lastName,
                email: email
            }
        });
    }
});
module.exports = router;