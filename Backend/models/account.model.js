const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    name:{
        type: String,
        require: true
    },
    
    type:{
        type: String,
        enum: ['savings', 'checking', 'credit', 'loan', 'investment', 'other'],
        default: 'other'
    },

    balance:{
        type: Number,
        default: 0
    },

    isDefault: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }

},
{
    timestamps: true,
    toJSON: {virtuals: true, getters: true},
    toObject: {virtuals: true, getters: true}
})

module.exports = mongoose.model('Account', accountSchema);