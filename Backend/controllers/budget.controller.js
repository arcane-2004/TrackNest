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

        // ---------- Date ranges ----------
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

        // Week (Monday start)
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), diff);
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        // Month
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        // Year
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const endOfYear = new Date(now.getFullYear() + 1, 0, 1);

        // ---------- Aggregation ----------
        const result = await transactionModel.aggregate([
            {
                $match: {
                    accountId,
                    userId: user._id,
                    isExpense: true
                }
            },
            {
                $facet: {
                    Daily: [
                        { $match: { date: { $gte: startOfDay, $lt: endOfDay } } },
                        { $group: { _id: null, total: { $sum: "$amount" } } }
                    ],
                    Weekly: [
                        { $match: { date: { $gte: startOfWeek, $lt: endOfWeek } } },
                        { $group: { _id: null, total: { $sum: "$amount" } } }
                    ],
                    Monthly: [
                        { $match: { date: { $gte: startOfMonth, $lt: endOfMonth } } },
                        { $group: { _id: null, total: { $sum: "$amount" } } }
                    ],
                    Yearly: [
                        { $match: { date: { $gte: startOfYear, $lt: endOfYear } } },
                        { $group: { _id: null, total: { $sum: "$amount" } } }
                    ]
                }
            }
        ]);

        // ---------- Safe extraction ----------
        const agg = result?.[0] || {};

        const expenses = {
            Daily: agg.daily?.[0]?.total ?? 0,
            Weekly: agg.weekly?.[0]?.total ?? 0,
            Monthly: agg.monthly?.[0]?.total ?? 0,
            Yearly: agg.yearly?.[0]?.total ?? 0,
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