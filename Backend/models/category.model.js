const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },

    name : {
        type: String,
        required: true,
    },

    color: {
        type: String,
    },

    icon: {
        type: String,
    },

    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true,
    },

    isDefault: { 
        type: Boolean, 
        default: false 
    },

},{timestamps: true })

module.exports = mongoose.model('Category', categorySchema);