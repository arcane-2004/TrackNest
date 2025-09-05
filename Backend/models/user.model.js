const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    name : {
        type: String,
        required: true,
    },
    email :{
        type: String,
        required: true,
    },
    password:{
        type: String,
        
    },
    imageUrl :{
        type: String,
        required: true,
    },
    googleId: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },

    password_otp: {
        otp : {
            type: String,
        },
        sendTime:{
            type: String,
        },
        limit: {
            type: Number,
            default: 5
        }
        
    }
},{timestamps: true })


module.exports = mongoose.model('User', userSchema)