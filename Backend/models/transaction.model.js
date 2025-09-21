const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },

    name: {
        type: String,
    },

    type: {
        type: String,
        enum: ['income', 'expanse', 'transfer'] 
    },

    amount: {
        type: Number,
        required: true
    },

    description: {
        type: String
    },

    paymentMethod: {
        type: String,
        enum: ['cash', 'credit card', 'debit card', 'bank transfer', 'upi', 'auto debit' ,'other'],
        default: 'upi'
    },

    date: {
        type: Date,
        default: Date.now,
    },

    category: {
        type: String,
    },

    receiptUrl: {
        type: String,
    },

    isRecurring: {
        type: Boolean,
        default: false
    },

    recurringInterval: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly']
    },

    nextRecurringDate: {
        type: Date,
    },

    lastProcessed: {
        type: Date
    },

    status: {
        type: String,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    }


},
{
    timestamps: true,
    toJSON: {virtuals: true, getters: true},
    toObject: {virtuals: true, getters: true}
})

module.exports = mongoose.model('Transaction', transactionSchema);