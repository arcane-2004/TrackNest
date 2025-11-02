const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: trusted,
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
        enum: ['INCOME', 'EXPANSE'],
        required: true,
    },
},{timestamps: true })

module.exports = mongoose.model('Category', categorySchema);