require('dotenv').config();
const connectToDb = require('./DB/db')
const express = require("express");
const { json } = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser")
const session = require("express-session")
const passport = require("passport")
const googleStrategy = require('passport-google-oauth20').Strategy;
const userRoute = require('./routes/user.route');

const app = express();

connectToDb();

// Middleware
app.use(json()); // JSON parser middleware
app.use(express.urlencoded({ extended: true })); // URL-encoded parser
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
})); // CORS middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}))
app.use(cookieParser());

//google login config

app.use(passport.initialize())
app.use(passport.session())

passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/user/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    // console.log(profile);

    return done(null, profile);
}))

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})


//routes
app.get('/', (req, res) => {
    res.send("your app just started");
})


app.use('/user', userRoute);



module.exports = app;