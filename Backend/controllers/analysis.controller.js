const categoryModel = require('../models/category.model');
const transactionModel = require('../models/transaction.model');
const mongoose = require("mongoose");

module.exports.categorySummary = async (req, res, next) => {

    const { accountId } = req.params;
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: "Unauthorized", error: "user not found" });
    }

    try {
        const accountObjectId = new mongoose.Types.ObjectId(accountId);

        const now = new Date();

        // DAY
        const startOfDay = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate()
        ));
        const endOfDay = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate() + 1
        ));

        // WEEK (Monday)
        const startOfWeek = new Date(startOfDay);
        startOfWeek.setUTCDate(startOfDay.getUTCDate() - (startOfDay.getUTCDay() || 7) + 1);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 7);

        // MONTH
        const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
        const endOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

        // YEAR
        const startOfYear = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
        const endOfYear = new Date(Date.UTC(now.getUTCFullYear() + 1, 0, 1));

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
                        { $match: { dateTime: { $gte: startOfDay, $lt: endOfDay } } },
                        ...groupAndProjectStage()
                    ],

                    Weekly: [
                        { $match: { dateTime: { $gte: startOfWeek, $lt: endOfWeek } } },
                        ...groupAndProjectStage()
                    ],

                    Monthly: [
                        { $match: { dateTime: { $gte: startOfMonth, $lt: endOfMonth } } },
                        ...groupAndProjectStage()
                    ],

                    Yearly: [
                        { $match: { dateTime: { $gte: startOfYear, $lt: endOfYear } } },
                        ...groupAndProjectStage()
                    ],

                    All: [
                        ...groupAndProjectStage()
                    ]
                }
            }
        ]);

        console.log("summary", summary)
        return res.status(200).json({ message: "Category summary fetched successfully", data: summary });

    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }


}