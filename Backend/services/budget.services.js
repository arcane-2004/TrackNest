const budgetModel = require("../models/budget.model");
const mongoose = require('mongoose');
const sendBudgetAlertMail = require("../utils/sendMail.utils");
const transactionModel = require("../models/transaction.model")
const {getDateRange}= require("../utils/getDateRange");

module.exports.createBudget = async ({ userId, accountId, scope, categoryId, limit, period }) => {
    console.log('data', {
        userId,
        accountId,
        scope,
        categoryId,
        limit,
        period
    })
    if (!userId || !accountId || !limit || !period) {
        throw new Error('Fields required ');
    }

    else {
        const budget = await budgetModel.create({
            userId,
            accountId,
            scope,
            categoryId,
            limit,
            period
        })
        return budget;
    }
}

module.exports.evaluateBudgets = async (user, accountId) => {


    const budgets = await budgetModel
        .find({ userId: user._id, accountId })
        .populate('categoryId');

    console.log('budgets', budgets)

    const accountObjectId = new mongoose.Types.ObjectId(accountId);

    for (const budget of budgets) {

        const { utcStart, utcEnd } = await getDateRange(budget.period);

        const match = {
            userId: user._id,
            accountId: accountObjectId,
            isExpense: true,
            dateTime: { $gte: utcStart, $lt: utcEnd }
        };

        if (budget.scope === "category") {
            match.categoryId = budget.categoryId._id;
        }

        const result = await transactionModel.aggregate([
            { $match: match },
            { $group: { _id: null, spent: { $sum: { $abs: "$amount" } } } }
        ]);
        console.log('res', result)
        const spent = result?.[0]?.spent ?? 0;

        remaining = budget.limit - spent;
        const percentUsed =
            budget.limit > 0 ? (spent / budget.limit) * 100 : 0;

        // 🚨 ALERT LOGIC HERE
        if (percentUsed >= 80 && !budget.alertSent) {

            const subject = `⚠️ Budget Alert — ${percentUsed.toFixed(0)}% Used`;

            const text = `Budget Usage Alert

                        Category: ${budget.categoryId?.name || "Overall"}
                        Period: ${budget.period}

                        Budget Limit: ₹${budget.limit}
                        Spent: ₹${spent}
                        Remaining: ₹${remaining}

                        You have used ${percentUsed.toFixed(2)}% of your budget.

                        Please review your spending.`;

            const html = `<h2>⚠️ Budget Usage Alert</h2>

                            <p><strong>Category:</strong> ${budget.categoryId?.name || "Overall"}</p>
                            <p><strong>Period:</strong> ${budget.period}</p>

                        <hr/>

                            <p><strong>Budget Limit:</strong> ₹${budget.limit}</p>
                            <p><strong>Spent:</strong> ₹${spent}</p>
                            <p><strong>Remaining:</strong> ₹${remaining}</p>

                            <h3 style="color:#e67e22;">
                            Used: ${percentUsed.toFixed(2)}%
                            </h3>

                            <p>Please review your spending to stay within your budget.</p>`;

            console.log('budget', budget)
            const data = {
                email: user.email,
                subject,
                text,
                html
            }
            await sendBudgetAlertMail(data);
            budget.alert80Sent = true;
            await budget.save();
        }
    }
}


function startOfUTCWeek(date) {
    const d = new Date(date);
    const day = d.getUTCDay(); // 0 = Sun, 1 = Mon
    const diff = day === 0 ? -6 : 1 - day; // Monday as start
    d.setUTCDate(d.getUTCDate() + diff);
    d.setUTCHours(0, 0, 0, 0);
    return d;
}

function isPeriodOver(budget) {
    const now = new Date();
    const last = new Date(budget.lastResetAt);

    switch (budget.period) {
        case "Daily":
            return (
                now.getUTCFullYear() !== last.getUTCFullYear() ||
                now.getUTCMonth() !== last.getUTCMonth() ||
                now.getUTCDate() !== last.getUTCDate()
            );

        case "Weekly":
            return (
                startOfUTCWeek(now).getTime() !==
                startOfUTCWeek(last).getTime()
            );

        case "Monthly":
            return (
                now.getUTCFullYear() !== last.getUTCFullYear() ||
                now.getUTCMonth() !== last.getUTCMonth()
            );

        case "Yearly":
            return now.getUTCFullYear() !== last.getUTCFullYear();

        default:
            return false;
    }
}

module.exports.getBudgets = async (user, accountId) => {

    const budgetArray = []
    try {
        const budgets = await budgetModel
            .find({ userId: user._id, accountId })
            .populate('categoryId');

        const accountObjectId = new mongoose.Types.ObjectId(accountId);

        for (const budget of budgets) {

            const { utcStart, utcEnd } = await getDateRange(budget.period);

            const match = {
                userId: user._id,
                accountId: accountObjectId,
                isExpense: true,
                dateTime: { $gte: utcStart, $lt: utcEnd }
            };

            if (budget.scope === "category") {
                match.categoryId = budget.categoryId._id;
            }

            const result = await transactionModel.aggregate([
                { $match: match },
                { $group: { _id: null, spent: { $sum: { $abs: "$amount" } } } }
            ]);
            const spent = result?.[0]?.spent ?? 0;

            const remaining = budget.limit - spent;
            const percentUsed = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;

            budgetArray.push({
                budgetId: budget._id,
                scope: budget.scope,
                categoryId: budget.categoryId || null,
                period: budget.period,
                periodStart: utcStart,
                periodEnd: utcEnd,
                limit: budget.limit,
                spent,
                remaining,
                percentUsed,
            });
        }

        return budgetArray;

    } catch (error) {
        console.log('Failed to fetch budget', error)
        return null;
    }
}


module.exports.resetExpiredBudgets = async () => {
    const budgets = await budgetModel.find();
    for (const budget of budgets) {
        if (isPeriodOver(budget)) {
            await budgetModel.updateOne(
                { _id: budget._id },
                {
                    $set: {
                        alert80Sent: false,
                        lastResetAt: new Date()
                    }
                }
            );
        }
    }
}


