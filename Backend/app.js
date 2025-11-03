require('dotenv').config();
const connectToDb = require('./DB/db')
const express = require("express");
const { json } = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser")
const session = require("express-session")
const passport = require('./config/passport');
const userRoute = require('./routes/user.route');
const accountRoute = require('./routes/account.route');
const transctionRoute = require('./routes/transaction.route');
const budgetRoute = require('./routes/budget.route')

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


//routes
app.get('/', (req, res) => {
    res.send("your app just started");
})


app.use('/user', userRoute);

app.use('/account', accountRoute);

app.use('/transaction', transctionRoute);

app.use('/budget', budgetRoute);

app.use('/category', categoryRoute);





module.exports = app;