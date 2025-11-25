const transactionModel = require("../models/transaction.model");
const mongoose = require('mongoose');
const transactionData = require('./transactions_data.json');
require('dotenv').config();

const seedTransactions = async () => {

    try{
        console.log("connercting to db....");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("connected to db");

        await transactionModel.insertMany(transactionData);
        console.log("transaction seeded successfully!");
    }catch(error){
        console.error("error :", error);
    }finally{
        await mongoose.disconnect();
    }
}

seedTransactions();