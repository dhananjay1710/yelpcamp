//Environment variable

if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

//Viewing env secret: console.log(process.env.SECRET);

// Required Files
const express = require('express');
const path = require('path');
const app = express(); //Similar to app = Flask(__name__)
const mongoose = require('mongoose'); // mongoose connects to mongoDB
const campground = require('./models/campground'); // base structure for our mongo DB schema
const methodOverride = require('method-override'); // Required to allow put requests and not just post/get
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync')
const expressError = require('./utils/expressError');
const { STATUS_CODES } = require('http');
const Review = require('./models/review');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const flash = require('connect-flash');


// Use JOI schema to detect user input errors and display relevant error messages.
// Ignoring grouped routing for now

// Connecting Database

const db_url = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';



//mongoose.connect('mongodb://localhost:27017/yelp-camp', { //setup Mongo DB
mongoose.connect(db_url, {  
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once("open", () => {
    console.log('Database Connected');
});

//Set inital params to access views etc
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Use these settings for every request
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

const secret = process.env.SECRET || 'thisshouldbeasecret';

const sessionConfig = {
    name: 'session',
    secret: secret,
    resave: false,
    saveUninitialised: true,
    cookies: {
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
        httpOnly: true
    }
}
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//Routes

const userroutes = require('./routes/users');
const cgroutes = require('./routes/campgrounds');
const reviewroutes = require('./routes/reviews');

app.use('/', userroutes);
app.use('/campgrounds', cgroutes);
app.use('/campgrounds/:id/reviews', reviewroutes);

app.get('/', (req, res) => { //Similar to @app.route('/') and then declare the function.
    res.render('home');
})


//Error handler
app.all('*', (req, res, next)=>{
    next(new expressError('Page not found!!!', 404));
})

app.use((err, req, res, next) => {
    const {statusCode=500, message='Something went wrong'} = err;
    res.status(statusCode).send(message);
})

app.listen(3000, () => { //if __name__ == __main__ app.run()
    console.log('Serving on port 3000');
})