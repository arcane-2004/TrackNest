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
            categoryId,
            isCategoryBudget: isCategoryBudget,
            limit: limit,
            period: period,
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

    // ------------- resolve date range -----------------
    // function getDateRange(period) {
    //     const now = new Date();

    //     switch (period) {
    //         case "Daily": {
    //             const start = new Date(Date.UTC(
    //                 now.getUTCFullYear(),
    //                 now.getUTCMonth(),
    //                 now.getUTCDate()
    //             ));
    //             const end = new Date(start);
    //             end.setUTCDate(start.getUTCDate() + 1);
    //             return { start, end };
    //         }

    //         case "Weekly": {
    //             const start = new Date(Date.UTC(
    //                 now.getUTCFullYear(),
    //                 now.getUTCMonth(),
    //                 now.getUTCDate() - (now.getUTCDay() || 7) + 1
    //             ));
    //             const end = new Date(start);
    //             end.setUTCDate(start.getUTCDate() + 7);
    //             return { start, end };
    //         }

    //         case "Monthly": {
    //             const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    //             const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
    //             return { start, end };
    //         }

    //         case "Yearly": {
    //             const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
    //             const end = new Date(Date.UTC(now.getUTCFullYear() + 1, 0, 1));
    //             return { start, end };
    //         }
    //     }
    // }


    try {

        const budgets = await budgetModel.find({ accountId: accountId, userId: user._id }).populate('categoryId');
        if (!budgets) {
            return res.status(404).json({ message: "Budget not found." })
        }
        const accountObjectId = new mongoose.Types.ObjectId(accountId);

        // Evaluate each budget
        const budgetArray = await Promise.all(
            budgets.map(async (budget) => {

                const { start, end } = await budgetModel.getDateRange(budget.period);

                const match = {
                    userId: user._id,
                    accountId: accountObjectId,
                    isExpense: true,
                    dateTime: { $gte: start, $lt: end }
                };

                // Category filter only if needed
                if (budget.scope === "category") {
                    match.categoryId = budget.categoryId;
                }

                const result = await transactionModel.aggregate([
                    { $match: match },
                    {
                        $group: {
                            _id: null,
                            spent: { $sum: { $abs: "$amount" } }
                        }
                    }
                ]);

                const spent = result?.[0]?.spent ?? 0;

                // ---------- calculating remaining and percentUsed ----------
                const remaining = budget.limit - spent;
                const percentUsed = budget.limit > 0
                    ? Math.min(100, (spent / budget.limit) * 100)
                    : 0;


                return {
                    budgetId: budget._id,
                    scope: budget.scope,
                    categoryId: budget.categoryId || null,
                    period: budget.period,
                    limit: budget.limit,
                    spent,
                    remaining,
                    percentUsed,
                };
            })
        );

        console.log('result', budgetArray)

        return res.status(200).json({
            budgets: budgetArray
        });


    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports.updateBudget = async (req, res, next) => {
    const { budgetId } = req.params;
    const user = req.user;
    const values = req.body;

    if (!user) {
        return res.status(401).json({ message: "Unauthorized", error: "user not found" })
    }

    if (!budgetId) {
        return res.status(404).json({ message: "Something went Wrong", error: "budget not found" })
    }

    try {

        const budget = await budgetModel.findByIdAndUpdate(
            { _id: budgetId, userId: user._id },
            { $set: values },
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

module.exports.deleteBudget = async (req, res, next) => {
    const { budgetId } = req.params;
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: "Unauthorized", error: "User not found" })
    }
    console.log(budgetId);
    if (!budgetId) {
        return res.status(404).json({ message: "Something went wrong", error: "Budget not found" })
    }
    try {
        const deletedBudget = await budgetModel.findByIdAndDelete(
            {
                _id: budgetId,
                userId: user._id
            }
        )
        return res.status(200).json({ message: "Budget deleted successfully", deletedBudget: deletedBudget });
    }
    catch (error) {
        return res.status(500).json({ mesage: "Internal server error", error: error.message });
    }
}