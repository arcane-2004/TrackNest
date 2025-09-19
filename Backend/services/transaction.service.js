const transactionModel = require('../models/transaction.model');

module.exports.createTransaction = async ({
    userId, accountId, amount, type, category, date, description, paymentMethod, receiptUrl, isRecurring, recurringInterval, nextRecurringDate, lastProcessed
}) => {
    
    const transaction = transactionModel.create({
        userId, accountId, amount, type, category, date, description, paymentMethod, receiptUrl, isRecurring, recurringInterval, nextRecurringDate, lastProcessed
    })

    return transaction;
}