const transactionModel = require('../models/transaction.model');
const userModel = require('../models/user.model');
const accountModel = require('../models/account.model');
const transactionService = require('../services/transaction.service');

module.exports.addTransaction = async (req, res, next) => {

    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const accounts = await accountModel.find({ userId: user._id });
        
        const { name, amount, type, category, date, description, paymentMethod, receiptUrl, isRecurring, recurringInterval, nextRecurringDate, lastProcessed, accountType } = req.body;
        let currentAccount;
        if(!accountType) {
            currentAccount =  accounts.find(account => account.isDefault === true);
        }
        else{
            currentAccount = accounts.find(account => account.type === accountType);;
        }
        
        const newTransaction = await transactionService.createTransaction({
            userId: user._id,
            accountId: currentAccount._id,
            name,
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

        await balanceUpdate(currentAccount, amount, type)

        return res.status(201).json({message: 'Transaction added successfully', transaction: newTransaction});

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports.getTransactions = async(req, res, next) => {
    const user = req.user;
    if(!user){
        return res.status(401).json({message: 'unauthorized'});
    }

    try{
        const transactions = await transactionModel.find({userId: user._id}).sort({date: -1});

        return res.status(200).json({transactions});
    }
    catch(error){
        return res.status(500).json({message: 'Internal server error'});
    }
}



const balanceUpdate = async (account, amount, type) => {

    try {
        account.balance += type === 'income' ? amount : -amount;
        await account.save();
    } catch (error) {
        console.error('Error updating balance:', error);
    }
}