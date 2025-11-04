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

		const { name, amount, type, category, date, time, description, paymentMethod, receiptUrl, isRecurring, recurringInterval, nextRecurringDate, lastProcessed, accountName } = req.body;

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

		// find the current selected account
		let currentAccount;
		console.log(accountName)
		if (!accountName) {
			currentAccount = accounts.find(account => account.isDefault === true);
		}
		else {
			currentAccount = accounts.find(account => account.name === accountName);;
		}
		console.log(currentAccount)
		const newTransaction = await transactionService.createTransaction({
			userId: user._id,
			accountId: currentAccount._id,
			name,
			amount,
			type,
			category,
			dateTime,
			description,
			paymentMethod,
			accountName: currentAccount.name,
			receiptUrl,
			isRecurring,
			recurringInterval,
			nextRecurringDate,
			lastProcessed
		})

		await balanceUpdate(currentAccount, amount, type)

		return res.status(201).json({ message: 'Transaction added successfully', transaction: newTransaction });

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
		const transactions = (await transactionModel.find({ userId: user._id }).sort({ date: -1 })).populate('categoryId');

		return res.status(200).json({ transactions });
	}
	catch (error) {
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


const balanceUpdate = async (account, amount, type) => {

	try {
		account.balance += type === 'income' ? amount : -amount;
		await account.save();
	} catch (error) {
		console.error('Error updating balance:', error);
	}
}