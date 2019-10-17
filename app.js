const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const app = express();
// Passport config
require('./config/passport')(passport);

// DB Config
const DB_URI = require('./config/keys').dbURI;

// Connect to Mongo
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully!'))
    .catch((err) => console.log('Connection error: ', err));

// EJS - config for view
app.use(expressLayouts);
app.set('view engine', 'ejs');



app.use(express.static("public"));
app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'woot',
    resave: false,
    saveUninitialized: false
}));

// Bodyparser - this configuration use to pass data via body
app.use(express.urlencoded({ extended: false }));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
//app.use(app.router);

// Routes
app.use('/', require('./routes/indexRouter'));
app.use('/users', require('./routes/users-rooters/dashboardRouter'))
app.use('/users', require('./routes/users-rooters/loginRouter'));
app.use('/users', require('./routes/users-rooters/registerRouter'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));