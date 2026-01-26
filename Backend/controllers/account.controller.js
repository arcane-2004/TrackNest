const accountModel = require('../models/account.model');
const transactionModel = require('../models/transaction.model')
const userModel = require('../models/user.model');
const accountService = require('../services/account.services');

module.exports.addAccount = async (req, res, next) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    try {
        const { name, type, balance } = req.body;
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
            balance: balance || 0,
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

        if (account.isDefault === true) {
            return res.status(400).json({ message: "Need atleast 1 default account" });
        }

        await accountModel.updateOne({ userId: user._id, isDefault: true }, { isDefault: false })

        account.isDefault = true;
        await account.save();

        return res.status(200).json({ message: 'Default account updated successfully', account: account })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
}

module.exports.updateAccount = async (req, res, next) => {

    const { id } = req.params;
    const { values } = req.body;

    try {
        const account = await accountModel.findById(id);

        if (!account) {
            return res.status(404).json({ message: "Something went wrong", error: "Account not found" });
        }

        const updatedAccount = await accountModel.findByIdAndUpdate({ _id: id }, { $set: values }, { new: true });
        console.log("updatedAccount", updatedAccount)
        return res.status(200).json({ message: "Account updated successfully", account: updatedAccount });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports.getAccountById = async (req, res, next) => {

    const { id } = req.params;

    try {
        const account = await accountModel.findById(id);
        if (!account) {
            return res.status(404).json({ message: "Something went wrong", error: "Account not found" });
        }
        return res.status(200).json({ account });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports.deleteAccount = async (req, res, next) => {

    const {id} = req.params;
  
    try{
        const account = await accountModel.findById(id);
        if(!account){
            return res.status(404).json({message:"Something went wrong", error:"account not found"})
        }

        await accountModel.findByIdAndDelete(id);

        await transactionModel.deleteMany({accountId: id});

        return res.status(200).json({message: "Account deleted successfully"});
    }catch(error){
        return res.status(500).json({message: "Internal server error", error: error.message});
    }
}