const transactionModel = require('../models/transaction.model');

module.exports.createTransaction = async ({
    userId, accountId, categoryId, name, amount, isExpense, dateTime, description, paymentMethod, receiptUrl, isRecurring, recurringInterval, nextRecurringDate, lastProcessed
}) => {
    
    const transaction = transactionModel.create({
        userId, accountId, categoryId, name, amount, isExpense, dateTime, description, paymentMethod, receiptUrl, isRecurring, recurringInterval, nextRecurringDate, lastProcessed
    })

    return transaction;
}