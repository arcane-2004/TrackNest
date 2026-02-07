const categoryModel = require('../models/category.model');
const transactionModel = require('../models/transaction.model');
const mongoose = require("mongoose");
const budgetInsightsServices = require("../services/budgetInsights.services")
const aiInsightsServices = require("../services/budgetAiInsights.services");
const completeInsightsServices = require("../services/completeInsights.services");


const IST_OFFSET_MINUTES = 5 * 60 + 30;

const istToUtc = (date) =>
    new Date(date.getTime() - IST_OFFSET_MINUTES * 60 * 1000);

const buildUtcRange = ({ range, year, month, date }) => {
    let startDate, endDate;

    if (range === "Daily") {
        if (date) {
            const [y, m, d] = date.split("-").map(Number);
            const istStart = new Date(y, m - 1, d, 0, 0, 0, 0);
            const istEnd = new Date(y, m - 1, d, 23, 59, 59, 999);
            startDate = istToUtc(istStart);
            endDate = istToUtc(istEnd);
        } else {
            const istStart = new Date();
            istStart.setHours(0, 0, 0, 0);
            const istEnd = new Date();
            istEnd.setHours(23, 59, 59, 999);
            startDate = istToUtc(istStart);
            endDate = istToUtc(istEnd);
        }
    }

    if (range === "Monthly" && year && month) {
        const istStart = new Date(year, month - 1, 1, 0, 0, 0, 0);
        const istEnd = new Date(year, month, 0, 23, 59, 59, 999);
        startDate = istToUtc(istStart);
        endDate = istToUtc(istEnd);
    }

    if (range === "Yearly" && year) {
        const istStart = new Date(year, 0, 1, 0, 0, 0, 0);
        const istEnd = new Date(year, 11, 31, 23, 59, 59, 999);
        startDate = istToUtc(istStart);
        endDate = istToUtc(istEnd);
    }

    return startDate && endDate ? { $gte: startDate, $lte: endDate } : null;
};

module.exports.categorySummary = async (req, res, next) => {

    const { accountId } = req.params;
    const user = req.user;
    const { range, year, month, date } = req.query;

    if (!user) {
        return res.status(401).json({ message: "Unauthorized", error: "user not found" });
    }

    try {
        const accountObjectId = new mongoose.Types.ObjectId(accountId);

        const dateFilter = buildUtcRange({
            range,
            year: Number(year),
            month: Number(month),
            date
        });

        const match = {
            userId: user._id,
            accountId: accountObjectId,
            isExpense: true,
            dateTime: dateFilter
        }

        const summary = await transactionModel.aggregate([
            {
                $match: match
            },

            {
                $group: {
                    _id: "$categoryId",
                    total: { $sum: { $abs: "$amount" } }
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
                $project: {
                    _id: 0,
                    id: "$category._id",
                    label: "$category.name",
                    value: "$total",
                    color: "$category.color",
                    icon: "$category.icon"
                }
            }

        ]);

        const grandTotal = summary.reduce((s, i) => s + i.value, 0);

        const summaryData = summary.map(i => ({
            ...i,
            percentage: grandTotal ? (i.value / grandTotal) * 100 : 0
        }));

        // -------------------------
        // 2️⃣ TRANSACTIONS LIST
        // -------------------------


        const transactions = await transactionModel.find(match)
            .populate("categoryId", "name color icon")
            .sort({ date: -1 });


        return res.status(200).json({ message: "Category summary fetched successfully", summaryData: summaryData, categoryData: transactions });

    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }


}

module.exports.getTransactions = async (req, res, next) => {
    const { categoryId } = req.params;
    const user = req.user;
    const { range, year, month, date } = req.query;

    if (!user) {
        return res.status(401).json({ message: "Unauthorized", error: "user not found" });
    }

    const dateFilter = buildUtcRange({
        range,
        year: Number(year),
        month: Number(month),
        date
    });

    try {
        const categoryObjectId = new mongoose.Types.ObjectId(categoryId);

        const transactions = await transactionModel.find({
            userId: user._id,
            categoryId: categoryId,
            isExpense: true,
            dateTime: dateFilter
        }).sort({ dateTime: -1 }).populate('categoryId').populate('accountId');

        return res.status(200).json({
            message: "Transactions fetched successfully",
            transactions: transactions
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });


    }
}

module.exports.monthlyTrend = async (req, res, next) => {
    const { accountId } = req.params;
    const user = req.user;

    const year = Number(req.query.year);
    const now = new Date();

    const selectedYear = year || now.getUTCFullYear();

    const startOfYear = new Date(Date.UTC(selectedYear, 0, 1));
    const endOfYear = new Date(Date.UTC(selectedYear + 1, 0, 1));

    try {
        const accountObjectId = new mongoose.Types.ObjectId(accountId);

        const dailySummary = await transactionModel.aggregate([
            {
                $match: {
                    userId: user._id,
                    accountId: accountObjectId,
                    dateTime: {
                        $gte: startOfYear,
                        $lt: endOfYear
                    }
                }
            },
            {
                $facet: {
                    expense: [
                        { $match: { isExpense: true } },
                        {
                            $group: {
                                _id: {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: "$dateTime"
                                    }
                                },
                                total: { $sum: { $abs: "$amount" } }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                date: "$_id",
                                title: "$total",
                                color: '#E31212'
                            }
                        }
                    ],

                    income: [
                        { $match: { isExpense: false } },
                        {
                            $group: {
                                _id: {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: "$dateTime"
                                    }
                                },
                                total: { $sum: "$amount" }
                            },

                        },
                        {
                            $project: {
                                _id: 0,
                                date: "$_id",
                                title: "$total",
                                color: '#3AD611'
                            }
                        }
                    ]
                }
            }
        ]);

        return res.status(200).json({ dailySummary: dailySummary });

    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }

}

module.exports.monthSummary = async (req, res, next) => {
    const { accountId } = req.params;
    const user = req.user;
    const { year, month } = req.query;


    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const y = Number(year);
    const m = Number(month);


    const istStart = new Date(y, m, 1, 0, 0, 0, 0);
    const istEnd = new Date(y, m + 1, 0, 23, 59, 59, 999);

    startDate = istToUtc(istStart);
    endDate = istToUtc(istEnd);

    const accountObjectId = new mongoose.Types.ObjectId(accountId);

    try {
        const result = await transactionModel.aggregate([
            {
                $match: {
                    userId: user._id,
                    accountId: accountObjectId,
                    dateTime: { $gte: startDate, $lt: endDate }
                }
            },
            {
                $facet: {

                    // 🔹 Monthly totals
                    monthSummary: [
                        {
                            $group: {
                                _id: null,
                                expense: {
                                    $sum: {
                                        $cond: ["$isExpense", "$amount", 0]
                                    }
                                },
                                income: {
                                    $sum: {
                                        $cond: [{ $eq: ["$isExpense", false] }, "$amount", 0]
                                    }
                                }
                            }
                        },
                        { $project: { _id: 0 } }
                    ],

                    // 🔹 Daily expense array
                    dailyExpense: [
                        {
                            $match: { isExpense: true },

                        },
                        {
                            $group: {
                                _id: {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: "$dateTime",
                                        timezone: "Asia/Kolkata"
                                    }
                                },
                                total: { $sum: { $abs: "$amount" } }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                date: "$_id",
                                total: 1
                            }
                        },
                        { $sort: { date: 1 } }
                    ],

                    // 🔹 Daily income array
                    dailyIncome: [
                        { $match: { isExpense: false } },
                        {
                            $group: {
                                _id: {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: "$dateTime",
                                        timezone: "Asia/Kolkata"
                                    }
                                },
                                total: { $sum: "$amount" }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                date: "$_id",
                                total: 1
                            }
                        },
                        { $sort: { date: 1 } }
                    ]
                }
            }
        ]);

        return res.status(200).json({
            monthSummary: result[0].monthSummary[0] || { expense: 0, income: 0 },
            dailyExpense: result[0].dailyExpense,
            dailyIncome: result[0].dailyIncome
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};


module.exports.systemBudgetInsights = async (req, res, next) => {
    const { user, budgetArray } = req;

    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (!budgetArray) {
        return res.status(400).json({ message: 'No budget set' })
    }

    try {

        const insights = await budgetInsightsServices.buildBudgetInsights(budgetArray, user);
        const systemBudgetInsights = insights.map(insights => ({
            ...insights,
            messages: budgetInsightsServices.buildInsightMessage(insights)
        }))

        req.systemBudgetInsights = systemBudgetInsights;
        return res.status(200).json({message: "Budget system insights", systemBudgetInsights: systemBudgetInsights});

    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong', error: error })
    }
    finally{
        next();
    }

}

module.exports.aiBudgetInsights = async (req, res, next) => {

    const { user} = req;
    const {systemBudgetInsights} = req.body;
    

    if (!user) {
        return res.status(401).json({ message: "Unauthorized", error: 'user not found' });
    }

    if (!systemBudgetInsights) {
        return res.status(400).json({ message: 'error generating ai insights', error: "system budget insights not found" })
    }

    try {

        const aiInsights = await aiInsightsServices.generateAIInsights(systemBudgetInsights);

        return res.status(200).json({message: 'AI insights generated', aiBudgetInsights: aiInsights})

    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong', error: error })
    }

}

module.exports.completeInsights = async (req, res, next) => {

    const { user} = req;
    const {accountId} = req.params;
    

    if (!user) {
        return res.status(401).json({ message: "Unauthorized", error: 'user not found' });
    }

    if (!accountId) {
        return res.status(400).json({ message: 'error generating insights', error: "No account not found" })
    }

    try {

        const insights = await completeInsightsServices.generateInsights(user, accountId);

        return res.status(200).json({message: 'Complete insight', insights: insights});

    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong', error: error })
    }

}


