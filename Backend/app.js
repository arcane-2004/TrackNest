require('dotenv').config();
const express = require("express");
const { json } = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(json()); // JSON parser middleware
app.use(express.urlencoded({ extended: true })); // URL-encoded parser
app.use(cors()); // CORS middleware

//routes
app.get('/', (req, res) =>{
    res.send("your app jsut started");
})

module.exports = app;