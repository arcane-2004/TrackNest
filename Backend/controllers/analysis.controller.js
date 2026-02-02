const categoryModel = require('../models/category.model');
const transactionModel = require('../models/transaction.model');
const mongoose = require("mongoose");
const { getUTCRange } = require("../utils/dateRanges");

const daily = getUTCRange("Daily");
const weekly = getUTCRange("Weekly");
const monthly = getUTCRange("Monthly");
const yearly = getUTCRange("Yearly");

module.exports.categorySummary = async (req, res, next) => {

    const { accountId } = req.params;
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: "Unauthorized", error: "user not found" });
    }

    try {
        const accountObjectId = new mongoose.Types.ObjectId(accountId);

        const groupAndProjectStage = () => ([
            {
                $group: {
                    _id: "$categoryId",
                    total: { $sum: "$amount" }
                }
            },
            {
                $group: {
                    _id: null,
                    categories: {
                        $push: {
                            categoryId: "$_id",
                            total: "$total"
                        }
                    },
                    totalExpense: { $sum: "$total" }
                }
            },
            { $unwind: "$categories" },
            {
                $lookup: {
                    from: "categories",
                    localField: "categories.categoryId",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: "$category" },
            {
                $project: {
                    id: { $toString: "$category._id" }, // Nivo requires string id
                    label: "$category.name",
                    color: "$category.color",
                    icon: "$category.icon",
                    value: { $abs: "$categories.total" },
                    percentage: {
                        $multiply: [
                            {
                                $divide: [
                                    { $abs: "$categories.total" },
                                    { $abs: "$totalExpense" }
                                ]
                            },
                            100
                        ]
                    }
                }
            }
        ]);


        const summary = await transactionModel.aggregate([
            {
                $match: {
                    userId: user._id,
                    accountId: accountObjectId,
                    isExpense: true
                }
            },
            {
                $facet: {
                    Daily: [
                        { $match: { dateTime: { $gte: daily.start, $lt: daily.end } } },
                        ...groupAndProjectStage()
                    ],
                    Weekly: [
                        { $match: { dateTime: { $gte: weekly.start, $lt: weekly.end } } },
                        ...groupAndProjectStage()
                    ],
                    Monthly: [
                        { $match: { dateTime: { $gte: monthly.start, $lt: monthly.end } } },
                        ...groupAndProjectStage()
                    ],
                    Yearly: [
                        { $match: { dateTime: { $gte: yearly.start, $lt: yearly.end } } },
                        ...groupAndProjectStage()
                    ],
                    All: [
                        ...groupAndProjectStage()
                    ]
                }
            }
        ]);

        return res.status(200).json({ message: "Category summary fetched successfully", data: summary });

    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }


}

module.exports.getTransactions = async (req, res, next) => {
    const { categoryId } = req.params;
    const user = req.user;
    const { range } = req.query;

    if (!user) {
        return res.status(401).json({ message: "Unauthorized", error: "user not found" });
    }

    const { start, end } = getUTCRange(range);

    try {
        const categoryObjectId = new mongoose.Types.ObjectId(categoryId);




        const transactions = await transactionModel.find({
            userId: user._id,
            categoryId: categoryId,
            isExpense: true,
            dateTime: { $gte: start, $lt: end }
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

module.exports.monthSummary = async (req, res) => {
    const { accountId } = req.params;
    const user = req.user;
    const { year, month } = req.query;
    console.log(year, month)

    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const start = new Date(Date.UTC(year, month -1, 1))
    const end = new Date(Date.UTC(year, month , 1));

    console.log('start', month)
    console.log('end', end)
    const accountObjectId = new mongoose.Types.ObjectId(accountId);

    try {
        const result = await transactionModel.aggregate([
            {
                $match: {
                    userId: user._id,
                    accountId: accountObjectId,
                    dateTime: { $gte: start, $lt: end }
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
                                        date: "$dateTime"
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
