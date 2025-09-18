const accountModel = require('../models/account.model');

module.exports.createAccount = async ({
    userId, name, type, balance, isDefault
}) => {
    if(!userId || !name){
        throw new Error('All fields required')
    }

    const account = accountModel.create({
        userId : userId,
        name: name,
        type: type,
        balance: balance,
        isDefault: isDefault
    })

    return account;
}