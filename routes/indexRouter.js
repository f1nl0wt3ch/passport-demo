const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.render('indexView',
    {
        title: 'Create an account or login',
        loginBtn: 'Login',
        registerBtn: 'Register'
    }
));

module.exports = router