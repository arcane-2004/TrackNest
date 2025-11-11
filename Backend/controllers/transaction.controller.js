const transactionModel = require('../models/transaction.model');
const userModel = require('../models/user.model');
const accountModel = require('../models/account.model');
const transactionService = require('../services/transaction.service');

module.exports.addTransaction = async (req, res, next) => {

	const user = req.user;
	if (!user) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	try {
		const accounts = await accountModel.find({ userId: user._id });

		const { name, amount, isExpense, category, account, date, time, description, paymentMethod, receiptUrl, isRecurring, recurringInterval, nextRecurringDate, lastProcessed } = req.body;

		// Combine date + time if provided, else use current timestamp
		let dateTime;

		if (date && time) {
			// both provided
			dateTime = new Date(`${date}T${time}`);
		} else if (date && !time) {
			// only date → combine with current time
			const now = new Date();
			const [hours, minutes, seconds] = [
				now.getHours(),
				now.getMinutes(),
				now.getSeconds()
			];
			dateTime = new Date(date);
			dateTime.setHours(hours, minutes, seconds);
		} else if (!date && time) {
			// only time → use today's date
			const today = new Date();
			const dateStr = today.toISOString().split("T")[0];
			dateTime = new Date(`${dateStr}T${time}`);
		} else {
			// none provided → current
			dateTime = new Date();
		}

		//Get current account
		let currentAccount
		if (account) {
			currentAccount = accounts.find(acc => acc._id.toString() === account);
			if (!currentAccount) {
				return res.status(400).json({ message: "Account not found" });
			}
		} else {
			currentAccount = accounts.find(acc => acc.isDefault === true);
		}

		const newTransaction = await transactionService.createTransaction({
			userId: user._id,
			accountId: currentAccount._id,
			categoryId: category,
			name,
			amount,
			isExpense,
			dateTime,
			description,
			paymentMethod,
			receiptUrl,
			isRecurring,
			recurringInterval,
			nextRecurringDate,
			lastProcessed
		})

		await balanceUpdate(currentAccount, amount)

		return res.status(201).json({ message: 'Transaction added successfully!', transaction: newTransaction });

	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
}

module.exports.getTransactions = async (req, res, next) => {
	const user = req.user;
	if (!user) {
		return res.status(401).json({ message: 'unauthorized' });
	}

	try {
		const transactions = await transactionModel.find({ userId: user._id }).sort({ dateTime: -1 }).populate('categoryId').populate('accountId');

		return res.status(200).json({ transactions });
	}
	catch (error) {
		console.log(error)
		return res.status(500).json({ message: 'Internal server error' });
	}
}

module.exports.getAccountTransactions = async (req, res, next) => {
	try {
		const user = req.user;
		const { id } = req.params;

		if (!user || !id) {
			return res.status(401).json({ message: "Unauthorized access" });
		}

		const account = await accountModel.findOne({ _id: id, userId: user._id });
		if (!account) {
			return res.status(404).json({ message: "Account not found" });
		}

		const transactions = await transactionModel
			.find({ userId: user._id, accountId: id })
			.sort({ createdAt: -1 }); // latest first

		return res.status(200).json({
			message:
				transactions.length > 0
					? "Transactions fetched successfully"
					: "No transactions found for this account",
			account,
			transactions,
		});
	} catch (error) {
		console.error("Error fetching transactions:", error);
		return res.status(500).json({
			message: "Internal server error",
			error: error.message,
		});
	}
};

module.exports.deleteTransaction = async (req, res, next) => {
	const { id } = req.body; // ✅ use req.body, not req.data

	if (!id) {
		return res.status(400).json({ message: "There was a error in deleting transaction" });
	}

	try {

		const deleted = await transactionModel.findByIdAndDelete(id).populate('accountId');

		if (!deleted) {
			return res.status(404).json({ message: "Unable to delete Transaction" });
		}

		await balanceUpdate(deleted.accountId, deleted.amount * (-1));

		return res.status(200).json({ message: "Transaction deleted successfully" });
	} catch (error) {

		return res.status(500).json({ message: "Internal server error" });
	}
}

module.exports.updateTransaction = async (req, res, next) => {

	const { id } = req.params;
	const { data } = req.body;

	if (!id) {
		return res.status(401).json({ message: "Transaction id is required" });
	}
	try {
		// Find existing transaction
		const oldTransaction = await transactionModel.findById(id);
		if (!oldTransaction) {
			return res.status(404).json({ message: "Transaction not found" });
		}

		// Revert old balance impact
		const oldAccount = await accountModel.findById(oldTransaction.accountId);
		if (oldAccount) {
			oldAccount.balance -= oldTransaction.amount; // reverse old effect
			await oldAccount.save();
		}

		const updatedTransaction = await transactionModel.findByIdAndUpdate(
			{ _id: id },
			{ $set: data },
			{ new: true })

		// Apply new balance effect
		const newAccount = await accountModel.findById(updatedTransaction.accountId);
		
		if (newAccount) {
			balanceUpdate(newAccount, data.amount)
		}

		return res.status(200).json({ message: "Transaction updated!", transaction: updatedTransaction })

	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}

}


const balanceUpdate = async (account, amount) => {

	try {
		account.balance += amount;
		await account.save();
	} catch (error) {
		console.error('Error updating balance:', error);
	}
}