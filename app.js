// Require Modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const marketplaceRoutes = require('./routes/marketplaceRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
require('dotenv').config(); // ✅ load env variables from .env

// Create App
const app = express();

// Configure App
let port = process.env.PORT || 3000;
let host = process.env.HOST || 'localhost';
let mongoUri = process.env.MONGO_URI || '';
let sessionSecret = process.env.SESSION_SECRET || 'defaultSecret';
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect(mongoUri)
    .then(() => {
        app.listen(port, host, () => {
            console.log(`Server is running at http://${host}:${port}`);
        });
    })
    .catch(err => console.log(err.message));

// Mount Middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60*60*1000},
    store: new MongoStore({ mongoUrl: mongoUri })
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
});

// Routes
app.get('/', (req, res) => res.render('index'));
app.use('/market', marketplaceRoutes);
app.use('/users', userRoutes);

// Error handling
app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    if (!err.status) {
        err.status = 500;
        err.message = 'Internal Server Error';
    }
    res.status(err.status);
    res.render('error', { error: err });
});