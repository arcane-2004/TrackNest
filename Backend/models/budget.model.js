const mongoose = require('mongoose')

const BudgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },

    isCategoryBudget: {
        type: Boolean,
        default: false
    },

    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },

    limit: {
        type: Number,
    },

    period: {
        type: String,
        enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
        default: 'Monthly'
    },

    lastAlertSent: {
        type: Date,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    }
    ,
},
    {
        timestamps: true,
        toJSON: { virtuals: true, getters: true },
        toObject: { virtuals: true, getters: true }
    })



module.exports = mongoose.model('Budget', BudgetSchema)

