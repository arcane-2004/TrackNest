const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const budgetController = require('../controllers/budget.controller');

router.post('/get-budget', authMiddleware.authUser, budgetController.getBudget);



module.exports = router;