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

        const { scope, categoryId, limit, period } = req.body;

        const newBudget = await budgetService.createBudget({
            userId: user._id,
            accountId: accountId,
            scope: scope,
            categoryId,
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

    try {

        const budgetArray = await budgetService.getBudgets(user, accountId)

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

        const updateData = { ...values };

        if (values.scope === 'overall') {
            updateData.categoryId = null;
        }

        const budget = await budgetModel.findOneAndUpdate(
            { _id: budgetId, userId: user._id },
            { $set: updateData },
            { new: true }
        );

        if (!budget) {
            return res.status(404).json({ message: "Budget not found." });
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

module.exports.attachBudget = async (req, res, next) => {

    const { accountId } = req.params;
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: "Unauthorized", error: "user not found" })
    }

    try {

        const budgetArray = await budgetService.getBudgets(user, accountId)

        req.budgetArray = budgetArray;
        next();

    } catch (error) {
        console.log({ message: "Internal server error", error: error.message });
    }
}