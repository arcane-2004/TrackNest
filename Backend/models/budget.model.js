const mongoose = require('mongoose')

const BudgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },

    scope: {
        type: String,
        enum: ['overall', 'category'],
        default: 'overall'
    },

    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: function () {
            return this.scope === 'category';
        }
    },

    limit: {
        type: Number,
        required: true,
    },

    period: {
        type: String,
        enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
        default: 'Monthly'
    },

    alert80Sent: {
        type: Boolean,
        default: false
    },
    lastResetAt: {
        type: Date,
        default: Date.now
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },


},
    {
        timestamps: true,
        toJSON: { virtuals: true, getters: true },
        toObject: { virtuals: true, getters: true }
    })


BudgetSchema.statics.getDateRange = async function (period) {
    const now = new Date();

    switch (period) {
        case "Daily": {
            const start = new Date(Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate()
            ));
            const end = new Date(start);
            end.setUTCDate(start.getUTCDate() + 1);
            return { start, end };
        }

        case "Weekly": {
            const start = new Date(Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate() - (now.getUTCDay() || 7) + 1
            ));
            const end = new Date(start);
            end.setUTCDate(start.getUTCDate() + 7);
            return { start, end };
        }

        case "Monthly": {
            const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
            const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
            return { start, end };
        }

        case "Yearly": {
            const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
            const end = new Date(Date.UTC(now.getUTCFullYear() + 1, 0, 1));
            return { start, end };
        }
    }
}



module.exports = mongoose.model('Budget', BudgetSchema)

