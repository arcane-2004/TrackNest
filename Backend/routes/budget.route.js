const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const budgetController = require('../controllers/budget.controller');

router.post('/create/:accountId', authMiddleware.authUser, budgetController.createBudget);

router.get('/get-budget/:accountId', authMiddleware.authUser, budgetController.getBudget);

router.put('/update-budget/:accountId', authMiddleware.authUser, budgetController.updateBudget)


module.exports = router;