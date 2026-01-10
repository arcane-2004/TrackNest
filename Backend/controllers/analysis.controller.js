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

        console.log("transaction", transactions)

        return res.status(200).json({
            message: "Transactions fetched successfully",
            transactions : transactions
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });


    }
}