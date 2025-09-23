const accountModel = require('../models/account.model');
const userModel = require('../models/user.model');
const accountService = require('../services/account.services');

module.exports.addAccount = async (req, res, next) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    try {
        const { name, type, initialBalance, isDefault } = req.body;

        if (type !== 'Savings' && type !== 'Current' && type !== 'Credit' && type !== 'Loan' && type !== 'Investment' && type !== 'Other') {
            return res.status(400).json({ message: 'Invalid account type' })
        }

        if (isDefault) {
            await accountModel.updateMany({ userId: user._id }, { isDefault: false });
        }
        const newAccount = await accountService.createAccount({
            userId: user.id,
            name,
            type,
            balance: initialBalance,
            isDefault
        })

        return res.status(201).json({ message: 'Account created successfully', account: newAccount })

    } catch (error) {
        return res.status(500).json({ message: 'internal server error', error: error.message })
    }
}

module.exports.getAccounts = async (req, res, next) => {

    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'unauthorized' });
    }

    try {
        const accounts = await accountModel.find({ userId: user._id }).sort({ date: -1 });

        return res.status(200).json({ accounts});
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }

}