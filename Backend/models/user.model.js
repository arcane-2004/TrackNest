const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

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
            default: 100
        },
        last_attempt: {
            type: Object
        }
        
    }
},{timestamps: true })

userSchema.methods.generateAuthToken = function(){
    const accessToken = jwt.sign({email: this.email}, process.env.JWT_SECRET, {expiresIn: '10d'})
    return accessToken;
}

userSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password, 10)
}

userSchema.methods.comparePassword =async function(password){
    return await bcrypt.compare(password, this.password)
}




module.exports = mongoose.model('User', userSchema)