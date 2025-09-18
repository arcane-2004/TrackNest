const accountModel = require('../models/account.model');
const userModel = require('../models/user.model');
const accountService = require('../services/account.services');

module.exports.addAccount = async (req, res, next) => {
    const user = req.user;
    if(!user){
        return res.status(401).json({message: 'Unauthorized'})
    }

    try{
        const {name, type, balance, isDefault} = req.body;

        if(isDefault){
            await accountModel.updateMany({userId: user._id}, {isDefault: false});
        }
        const newAccount = accountService.createAccount({
            userId: user.id,
            name,
            type,
            balance,
            isDefault
        })

        return res.status(201).json({message: 'Account created successfully', account: newAccount})

    }catch(error){
        return res.status(500).json({message: 'internal server error', error: error.message})
    }
}