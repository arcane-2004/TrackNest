const transactionModel = require('../models/transaction.model');
const { differenceInCalendarDays, subDays } = require("date-fns")

async function buildCategoryBreakdown(user, start, end) {
    const categories = await transactionModel.aggregate([
        {
            $match: {
                userId: user._id,
                dateTime: {
                    $gte: start,
                    $lte: end
                },
                isExpense: true
            }
        },

        {
            $group: {
                _id: "$categoryId",
                amount: { $sum: { $abs: "$amount" } }
            }
        },
        {
            $lookup: {
                from: "categories",
                localField: "_id",
                foreignField: "_id",
                as: "category"
            }
        },
        { $unwind: "$category" },
        {
            $sort: { amount: -1 }
        },
        {
            $project: {
                _id: 0,
                categoryId: "$_id",
                category: "$category.name",
                amount: "$amount"
            }
        }
    ]);

    return categories;
}

function calculateBudgetHealth(budget) {

    try {
        const now = new Date();

        const totalDays =
            differenceInCalendarDays(budget.periodEnd, budget.periodStart) + 1;

        const rawDaysPassed =
            differenceInCalendarDays(now, budget.periodStart) + 1;

        const daysPassed = Math.min(Math.max(rawDaysPassed, 0), totalDays);
        const daysRemaining = totalDays - daysPassed;

        const expectedSpend = (budget.limit / totalDays) * daysPassed;
        const deviation = budget.spent - expectedSpend;

        let status;
        if (budget.percentUsed < 60) {
            status = deviation <= 0 ? "under_control" : "watch";
        } else if (budget.percentUsed < 80) {
            status = "watch";
        } else if (budget.percentUsed <= 100) {
            status = "at_risk";
        } else {
            status = "exceeded";
        }

        const deviationRatio = deviation / budget.limit;

        let trend;
        if (deviationRatio <= -0.05) trend = "behind";
        else if (deviationRatio >= 0.05) trend = "ahead";
        else trend = "on_track";

        return {
            budgetId: budget.budgetId,
            budgetName: budget.categoryId?.name || "Overall",
            status,
            trend,
            deviation,
            daysRemaining,
            usagePercent: budget.percentUsed
        }
    } catch (error) {
        console.error("Failed to process data:", error);
        throw error;
    }

}

async function analyzeCategorySpikes(user, budget) {

    try {
        // ================= top categories ====================
        const currentCategories = await buildCategoryBreakdown(user, budget.periodStart, budget.periodEnd);

        let topCategory = null
        if (currentCategories.length) {
            const top = currentCategories[0];
            topCategory = {
                category: top.category,
                amount: top.amount,
                percent: budget.spent > 0
                    ? (top.amount / budget.spent) * 100
                    : 0
            };
        }
        // ===================== spikes =========================
        const totalDays =
            differenceInCalendarDays(budget.periodEnd, budget.periodStart) + 1;

        const prevPeriodEnd = subDays(budget.periodStart, 1);
        const prevPeriodStart = subDays(prevPeriodEnd, totalDays - 1);

        const previousCategories = await buildCategoryBreakdown(user, prevPeriodStart, prevPeriodEnd);

        const prevMap = {};
        for (const cat of previousCategories) {
            prevMap[cat.categoryId.toString()] = cat.amount;
        }

        const categorySpikes = currentCategories.map(cat => {
            const prevAmount = prevMap[cat.categoryId.toString()] || 0;

            const increase =
                prevAmount === 0
                    ? null
                    : ((cat.amount - prevAmount) / prevAmount) * 100;

            return {
                category: cat.category,
                currentAmount: cat.amount,
                previousAmount: prevAmount,
                increasePercent: increase
            };
        });

        const SPIKE_THRESHOLD = 30; // %

        const spikes = categorySpikes.filter(
            c => c.increasePercent !== null && c.increasePercent >= SPIKE_THRESHOLD
        );
        spikes.sort((a, b) => b.increasePercent - a.increasePercent);

        return {
            topCategory,
            spikes
        }

    } catch (error) {
        console.error("Failed to process data:", error);
        throw error;
    }

}

module.exports.buildBudgetInsights = async (budgetArray, user) => {
    const results = [];

    for (const budget of budgetArray) {
        const health = calculateBudgetHealth(budget);
        const categoryInsights =
            budget.scope === "overall"
                ? await analyzeCategorySpikes(user, budget)
                : budget.categoryId.name;

        results.push({
            ...health,
            categoryInsights
        });
    }

    return results;
}

module.exports.buildInsightMessage = (insight) => {
    const messages = [];

    const {
        status,
        trend,
        daysRemaining,
        categoryInsights
    } = insight;

    // 🔴 Priority 1 — Budget health
    if (status === "exceeded") {
        messages.push({
            level: "danger",
            text: "You have exceeded this budget."
        });
    } else if (status === "at_risk") {
        messages.push({
            level: "warning",
            text: "You are close to exceeding this budget."
        });
    } else if (status === "watch") {
        messages.push({
            level: "info",
            text: "You are spending faster than planned."
        });
    }

    // 🟧 Priority 2 — Root cause
    if (categoryInsights?.spikes?.length) {
        const spike = categoryInsights.spikes[0];
        messages.push({
            level: "warning",
            text: `${spike.category} spending increased by ${spike.increasePercent.toFixed(0)}% compared to last period.`
        });
    } else if (categoryInsights?.topCategory) {
        const top = categoryInsights.topCategory;
        messages.push({
            level: "info",
            text: `${top.category} is your highest spending category (${top.percent.toFixed(0)}% of expenses).`
        });
    }

    // 🟦 Priority 3 — Context
    if (status === "under_control") {
        messages.push({
            level: "success",
            text: "Your spending is under control."
        });
    }

    // Limit messages
    return messages.slice(0, 3);
}
