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

// module.exports.createBudget = async ({
//     userId,
//     accountId,
//     isCategoryBudget,
//     categoryId,
//     limit,
//     period

// }) => {
//     console.log('service acc', accountId)
//     const doc = {
//         userId, // already ObjectId
//         accountId: new mongoose.Types.ObjectId(accountId), // ✅ explicit
//         isCategoryBudget,
//         limit: Number(limit),
//         period,
//     };

//     if (isCategoryBudget) {
//         doc.categoryId = new mongoose.Types.ObjectId(categoryId);
//     }

//     return await budgetModel.create(doc);
// };