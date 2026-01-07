const mongoose = require("mongoose");
const budgetModel = require('../models/budget.model');
const budgetService = require('../services/budget.services')
const transactionModel = require('../models/transaction.model');

module.exports.createBudget = async (req, res, next) => {

    const { accountId } = req.params;
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: "Unauthorized", error: "user not found" })
    }

    try {

        const { isCategoryBudget, categoryId, limit, period } = req.body;

        const newBudget = await budgetService.createBudget({
            userId: user._id,
            accountId: accountId,
            isCategoryBudget: isCategoryBudget,
            limit: limit,
            period: period,
            categoryId,
        })

        return res.status(201).json({ budget: newBudget, message: "Budget created successfully" })

    } catch (error) {
        return res.status(500).json({ message: "internal server error", error: error.message })
    }
}

module.exports.getBudget = async (req, res, next) => {

    const { accountId } = req.params;
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: "Unauthorized", error: "user not found" })
    }
    try {

        const budget = await budgetModel.find({ accountId: accountId, userId: user._id });
        if (!budget) {
            return res.status(404).json({ message: "Budget not found." })
        }

        const now = new Date();

        // DAY
        const startOfDay = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate()
        ));
        const endOfDay = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate() + 1
        ));

        // WEEK (Monday)
        const startOfWeek = new Date(startOfDay);
        startOfWeek.setUTCDate(startOfDay.getUTCDate() - (startOfDay.getUTCDay() || 7) + 1);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 7);

        // MONTH
        const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
        const endOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

        // YEAR
        const startOfYear = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
        const endOfYear = new Date(Date.UTC(now.getUTCFullYear() + 1, 0, 1));

        // ---------- Aggregation ----------
        const accountObjectId = new mongoose.Types.ObjectId(accountId);
        const result = await transactionModel.aggregate([
            {
                $match: {
                    accountId: accountObjectId,
                    userId: user._id,
                    isExpense: true
                }
            },
            {
                $facet: {
                    Daily: [
                        { $match: { dateTime: { $gte: startOfDay, $lt: endOfDay } } },
                        { $group: { _id: null, total: { $sum: { $abs: "$amount" } } } }
                    ],
                    Weekly: [
                        { $match: { dateTime: { $gte: startOfWeek, $lt: endOfWeek } } },
                        { $group: { _id: null, total: { $sum: { $abs: "$amount" } } } }
                    ],
                    Monthly: [
                        { $match: { dateTime: { $gte: startOfMonth, $lt: endOfMonth } } },
                        { $group: { _id: null, total: { $sum: { $abs: "$amount" } } } }
                    ],
                    Yearly: [
                        { $match: { dateTime: { $gte: startOfYear, $lt: endOfYear } } },
                        { $group: { _id: null, total: { $sum: { $abs: "$amount" } } } }
                    ]
                }
            }
        ]);

        // ---------- Safe extraction ----------
        const agg = result?.[0] || {};

        const expenses = {
            Daily: agg.Daily?.[0]?.total ?? 0,
            Weekly: agg.Weekly?.[0]?.total ?? 0,
            Monthly: agg.Monthly?.[0]?.total ?? 0,
            Yearly: agg.Yearly?.[0]?.total ?? 0,
        };

        console.log('budget', budget)
        console.log('expenses', expenses)

        return res.status(200).json({
            budget,
            expenses
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports.updateBudget = async (req, res, next) => {
    const { accountId } = req.params;
    const user = req.user;
    const { amount } = req.body;

    if (!user) {
        return res.status(401).json({ message: "Unauthorized", error: "user not found" })
    }

    try {

        const budget = await budgetModel.findOneAndUpdate(
            { accountId: accountId, userId: user._id },
            { amount: amount },
            { new: true }
        );

        if (!budget) {
            return res.status(404).json({ message: "Budget not found." })
        }

        return res.status(200).json({ message: "Budget updated successfully", budget: budget });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });

    }
}