const transactionModel = require('../models/transaction.model');
const userModel = require('../models/user.model');
const accountModel = require('../models/account.model');
const transactionSerivice = require('../services/transaction.service');

module.exports.addTransaction = async (req, res, next) => {

    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const accounts = await accountModel.find({ userId: user._id });
        
        const { amount, type, category, date, description, paymentMethod, receiptUrl, isRecurring, recurringInterval, nextRecurringDate, lastProcessed, accountType } = req.body;
        let currentAccount;
        if(!accountType) {
            currentAccount =  accounts.find(account => account.isDefault === true);
        }
        else{
            currentAccount = accounts.find(account => account.type === accountType);;
        }
        
        const newTransaction = transactionSerivice.createTransaction({
            userId: user._id,
            accountId: currentAccount._id,
            amount,
            type,
            category,
            date,
            description,
            paymentMethod,
            receiptUrl,
            isRecurring,
            recurringInterval,
            nextRecurringDate,
            lastProcessed

        })

        return res.status(201).json({message: 'Transaction added successfully', transaction: newTransaction});

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}
