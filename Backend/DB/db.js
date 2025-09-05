const mongoose = require('mongoose');
require('dotenv').config();

const connectToDb = () => {

    try {
        mongoose.connect(process.env.MONGO_URI).then(() => {
            console.log('connected to db');
        }).catch((err) => {
            console.log('failed to connect to db', err)
        })
    }
    catch (error) {
        console.log(error.message);
    }
}

module.exports = connectToDb