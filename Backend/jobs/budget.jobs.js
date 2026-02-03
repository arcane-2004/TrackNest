const cron = require("node-cron");
const { resetExpiredBudgets } = require("../services/budgetReset.service");

cron.schedule("0 * * * *", resetExpiredBudgets);