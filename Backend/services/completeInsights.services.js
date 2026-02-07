const mongoose = require("mongoose");
const transactionModel = require("../models/transaction.model")
const {aiResponse} = require("../utils/aiResponse")


async function monthlyAggregation(user, accountId, startDate, endDate) {

    const accountObjectId = new mongoose.Types.ObjectId(accountId);
    try {
        const monthlySummary = await transactionModel.aggregate([
            {
                $match: {
                    userId: user._id,
                    accountId: accountObjectId,
                    dateTime: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$dateTime" },
                        month: { $month: "$dateTime" },
                        isExpense: "$isExpense"
                    },
                    total: { $sum: { $abs: "$amount" } }
                }
            },
            {
                $group: {
                    _id: {
                        year: "$_id.year",
                        month: "$_id.month"
                    },
                    income: {
                        $sum: {
                            $cond: [{ $eq: ["$_id.isExpense", false] }, "$total", 0]
                        }
                    },
                    expense: {
                        $sum: {
                            $cond: [{ $eq: ["$_id.isExpense", true] }, "$total", 0]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    income: 1,
                    expense: 1,
                    savings: { $subtract: ["$income", "$expense"] }
                }
            },
            { $sort: { year: 1, month: 1 } }
        ]);

        return monthlySummary

    } catch (error) {
        console.log('Monthly aggregation: ', error);

    }
}

async function categoryAggregation(user, accountId, startDate, endDate) {

    const accountObjectId = new mongoose.Types.ObjectId(accountId);
    try {
        const categoryBreakdown = await transactionModel.aggregate([
            {
                $match: {
                    userId: user._id,
                    accountId: accountObjectId,
                    isExpense: true,
                    dateTime: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$dateTime" },
                        month: { $month: "$dateTime" },
                        categoryId: "$categoryId"
                    },
                    amount: { $sum: { $abs: "$amount" } }
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id.categoryId",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: "$category" },
            { $sort: { amount: -1 } },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    category: "$category.name",
                    amount: "$amount"
                }
            }
        ]);
        return categoryBreakdown;

    } catch (error) {
        console.log('Failed to do category aggregation: ', error)
    }

}

async function mergedAggregation(monthlySummary, categoryBreakdown) {
    try {
        const monthMap = {};

        monthlySummary.forEach(m => {
            const key = `${m.year}-${m.month}`;
            monthMap[key] = {
                ...m,
                topCategories: []
            };
        });

        categoryBreakdown.forEach(c => {
            const key = `${c.year}-${c.month}`;
            if (!monthMap[key]) return;

            if (monthMap[key].topCategories.length < 2) {
                monthMap[key].topCategories.push({
                    category: c.category,
                    amount: c.amount
                });
            }
        });

        const overviewTimeline = Object.values(monthMap);

        return overviewTimeline;

    } catch (error) {
        console.log('Error merging aggregations: ', error)
    }
}

async function detectTrend(overview) {
    try {
        // ============ sort data ============
        const sorted = overview.sort(
            (a, b) => a.year * 12 + a.month - (b.year * 12 + b.month)
        );

        const prev = sorted[0];
        const mid = sorted[1];
        const curr = sorted[2];

        // ================== get trend ===================
        function getTrend(a, b) {
            if (b > a) return "up";
            if (b < a) return "down";
            return "flat";
        }

        // ================= Income Trend Logic ==================
        const incomeTrend = {
            fromPrevToMid: getTrend(prev.income, mid.income),
            fromMidToCurr: getTrend(mid.income, curr.income)
        };

        let incomeSignal = "stable";

        if (
            incomeTrend.fromPrevToMid === "down" &&
            incomeTrend.fromMidToCurr === "down"
        ) {
            incomeSignal = "declining";
        } else if (
            incomeTrend.fromPrevToMid === "up" &&
            incomeTrend.fromMidToCurr === "up"
        ) {
            incomeSignal = "growing";
        }

        // ==========================Expense Trend Logic===================
        const expenseTrend = {
            fromPrevToMid: getTrend(prev.expense, mid.expense),
            fromMidToCurr: getTrend(mid.expense, curr.expense)
        };

        let expenseSignal = "controlled";

        if (
            expenseTrend.fromPrevToMid === "up" &&
            expenseTrend.fromMidToCurr === "up"
        ) {
            expenseSignal = "increasing";
        }

        // =============================== Savings Health Check ===================
        const savingsValues = sorted.map(m => m.savings);

        const savingsTrend =
            savingsValues[2] < savingsValues[1] &&
                savingsValues[1] < savingsValues[0]
                ? "shrinking"
                : savingsValues[2] > savingsValues[1]
                    ? "improving"
                    : "unstable";

        const consecutiveLoss = sorted.every(m => m.savings < 0);

        // ===================== Detect if 1 category dominates spending.===============
        function getDominantCategory(month) {
            const total = month.topCategories.reduce(
                (sum, c) => sum + c.amount,
                0
            );

            const top = month.topCategories[0];
            const ratio = top.amount / total;

            return {
                category: top.category,
                ratio
            };
        }

        const dominant = getDominantCategory(curr);
        // ==================== risk ======================
        const HIGH_AMOUNT = 5000;
        const MEDIUM_AMOUNT = 2500;

        let categoryRisk = "low";

        if (dominant.amount >= HIGH_AMOUNT && dominant.ratio >= 0.5) {
            categoryRisk = "high";
        } else if (
            dominant.amount >= MEDIUM_AMOUNT &&
            dominant.ratio >= 0.4
        ) {
            categoryRisk = "medium";
        }


        const dominantCategory = {
            name: dominant.category,
            risk: categoryRisk
        }

        return {
            incomeSignal,
            expenseSignal,
            savingsTrend,
            consecutiveLoss,
            dominantCategory
        }


    } catch (error) {
        console.log('error trend detection: ', error)
    }

}

async function buildOverviewPrompt(systemInsight) {
    return `
You are a financial assistant.

You are given system-generated financial signals.
These signals are already analyzed and correct.

Your task:
1. Write a short overall summary
2. Highlight key patterns
3. Suggest optional, practical tips

Rules:
- Use ONLY the provided data
- Do NOT invent numbers or dates
- Do NOT contradict the signals
- Be calm, supportive, and non-judgmental
- Tips must be suggestions, not commands

Respond ONLY in valid JSON using this schema:

{
  "summary": "string",
  "highlights": ["string"],
  "tips": ["string"],
  "tone": "positive | neutral | warning"
}

Data:
${JSON.stringify(systemInsight, null, 2)}
`;
}

module.exports.generateInsights = async (user, accountId) => {
    const MONTHS = 3;

    // End = end of current month in UTC
    const endDate = new Date(Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth() + 1,
        0,
        23, 59, 59, 999
    ));

    // Start = start of (MONTHS-1) months ago in UTC
    const startDate = new Date(Date.UTC(
        endDate.getUTCFullYear(),
        endDate.getUTCMonth() - (MONTHS - 1),
        1,
        0, 0, 0, 0
    ));

    try {
        const monthlySummary = await monthlyAggregation(user, accountId, startDate, endDate);
        const categoryBreakdown = await categoryAggregation(user, accountId, startDate, endDate);
        const overviewTimeline = await mergedAggregation(monthlySummary, categoryBreakdown);
        const systemInsightObject = await detectTrend(overviewTimeline);
        const userPrompt = await buildOverviewPrompt(systemInsightObject);
        const aiInsights = await aiResponse(userPrompt);
        
        return aiInsights

    } catch (error) {
        console.log('error generating insights: ', error)
    }
}