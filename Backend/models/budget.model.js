const mongoose = require('mongoose')

const budgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    amount: {
        type: Number,
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
    toJSON: {virtuals: true, getters: true},
    toObject: {virtuals: true, getters: true}
})

module.exports = mongoose.model('Budget', budgetSchema)