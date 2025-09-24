const accountModel = require('../models/account.model');
const userModel = require('../models/user.model');
const accountService = require('../services/account.services');

module.exports.addAccount = async (req, res, next) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    try {
        const { name, type, initialBalance } = req.body;
        let { isDefault } = req.body;

        if (type !== 'Savings' && type !== 'Current' && type !== 'Credit' && type !== 'Loan' && type !== 'Investment' && type !== 'Other') {
            return res.status(400).json({ message: 'Invalid account type' })
        }

        //  First account should always be default
        const count = await accountModel.countDocuments({ userId: user._id });
        if (count === 0) {
            isDefault = true;
        }

        //  If new account is set to default → reset others
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
        const accounts = await accountModel.find({ userId: user._id }).sort({ createdAt: -1 });

        return res.status(200).json({ accounts });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }

}

module.exports.updateDefault = async (req, res, next) => {

    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    try {
        const { accountId } = req.body;

        const account = await accountModel.findOne({ _id: accountId, userId: user._id });
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        if (account.isDefault === true){
            return res.status(400).json({message: "Need atleast 1 default account"});
        }

        await accountModel.updateOne({ userId: user._id, isDefault: true }, { isDefault: false })

        account.isDefault = true;
        await account.save();

        return res.status(200).json({ message: 'Default account updated successfully' , account: account})
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
}