const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware.js');
const analysisController = require('../controllers/analysis.controller');
const budgetController = require('../controllers/budget.controller.js')

router.get('/category-summary/:accountId', authMiddleware.authUser, analysisController.categorySummary);

router.get('/category/get-transactions/:categoryId', authMiddleware.authUser, analysisController.getTransactions);

router.get('/monthly-trend/:accountId', authMiddleware.authUser, analysisController.monthlyTrend);

router.get('/month-summary/:accountId', authMiddleware.authUser, analysisController.monthSummary);

router.get('/insights/budgets/:accountId', authMiddleware.authUser, budgetController.getBudget, analysisController.budgetInsights);

module.exports = router;    