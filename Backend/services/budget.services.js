const budgetModel = require("../models/budget.model");
const mongoose = require('mongoose');

module.exports.createBudget = async ({ userId, accountId, isCategoryBudget, categoryId, limit, period }) => {

    if (!userId || !accountId || !limit || !period) {
        throw new Error('Fields required ');
    }
    else {
        const budget = await budgetModel.create({
            userId,
            accountId,
            isCategoryBudget,
            categoryId,
            limit,
            period
        })
        return budget;
    }
}